/**
 * Extended OrbitControls for dxf-viewer.
 * Wraps the stock three.js OrbitControls with a mouseZoomSpeedFactor property
 * that allows different zoom speeds for mouse wheel vs touch pinch.
 * Also enables zoomToCursor by default for DXF viewing.
 */
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export class OrbitControls extends ThreeOrbitControls {
    constructor(object, domElement) {
        super(object, domElement)
        /**
         * Additional speed multiplier applied only to mouse wheel zoom events.
         * Touch pinch zoom is unaffected (uses base zoomSpeed only).
         * @type {number}
         */
        this.mouseZoomSpeedFactor = 1
        this.zoomToCursor = true

        this._baseZoomSpeed = this.zoomSpeed
        this._isMouseWheel = false

        // Flag mouse wheel events so _getZoomScale knows to apply the factor
        domElement.addEventListener("wheel", () => {
            this._isMouseWheel = true
            this._baseZoomSpeed = this.zoomSpeed
        }, { capture: true, passive: true })

        domElement.addEventListener("wheel", () => {
            this._isMouseWheel = false
        }, { capture: false, passive: true })
    }

    /**
     * Override _getZoomScale to apply mouseZoomSpeedFactor for wheel events
     * and use delta-independent scaling (matching pre-0.170 behavior) so that
     * fine-grained scroll devices (trackpads) remain responsive.
     */
    _getZoomScale(_delta) {
        if (this._isMouseWheel) {
            return Math.pow(0.95, this.zoomSpeed * this.mouseZoomSpeedFactor)
        }
        // Touch / programmatic: use stock delta-based formula
        const normalizedDelta = Math.abs(_delta * 0.01)
        return Math.pow(0.95, this.zoomSpeed * normalizedDelta)
    }
}
