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

        // Intercept wheel events to temporarily adjust zoomSpeed for mouse wheel
        // (before OrbitControls processes them). This replicates the original
        // dxf-viewer custom behavior of separate mouse/touch zoom speeds.
        this._baseZoomSpeed = this.zoomSpeed
        domElement.addEventListener("wheel", (e) => {
            this._baseZoomSpeed = this.zoomSpeed
            this.zoomSpeed = this._baseZoomSpeed * this.mouseZoomSpeedFactor
        }, { capture: true, passive: true })

        domElement.addEventListener("wheel", () => {
            // Restore after OrbitControls has processed the event
            this.zoomSpeed = this._baseZoomSpeed
        }, { capture: false, passive: true })
    }
}
