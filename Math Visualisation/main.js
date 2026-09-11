"use strict";

const VectorApp = {
    // Holds constants / app settings that usually don’t change at runtime
    config: {
        worldGridSize: 50,         
        pointSize: 6,         
        pointColor: "#ff6b6b",
        vectorColor: "#4cc9f0",
        axisColor: "#4cc9f0",
        gridColor: "#334155",
        labelColor: "#cbd5e1"
    },

    // Holds dynamic values that change during execution
    state: {
        point: { x: 90, y: -120 },
        draggingPoint: false,
        draggingPan: false,
        lastPointer: null,
        pointerId: null,

        cssWidth: 0,
        cssHeight: 0,
        dpr: 1
    },

    elements: {
        canvas: null,
        ctx: null,
        heading: null
    },

    viewport: {
        center: { x: 0, y: 0 },
        scale: 1   
    },

    setupElementsHandles() {
        this.elements.canvas = document.getElementById('canvas');
        this.elements.ctx = this.elements.canvas.getContext('2d');
        this.elements.heading = document.querySelector("#data-block h1");
    },

    init() {
        this.setupElementsHandles();
        this.attachEvents();
        this.setupCanvas();                 
        this.draw();                 
    },

    worldToScreen(worldPoint) {
        const { x: viewportCenterX, y: viewportCenterY } = this.viewport.center;
        const scale = this.viewport.scale;
        
        const screenX = (worldPoint.x - viewportCenterX) * scale + this.state.cssWidth / 2;
        const screenY = this.state.cssHeight / 2 - (worldPoint.y - viewportCenterY) * scale;
        return { x: screenX, y: screenY };
    },

    screenToWorld(screenPt) {
        const { x: viewportCenterX, y: viewportCenterY } = this.viewport.center;
        const scale = this.viewport.scale;

        const worldX = (screenPt.x - this.state.cssWidth / 2) / scale + viewportCenterX;
        const worldY = (this.state.cssHeight / 2 - screenPt.y) / scale + viewportCenterY;
        return { x: worldX, y: worldY };
    },

    clientToWorld(clientX, clientY) {
        const rect = this.elements.canvas.getBoundingClientRect();
        const cssX = clientX - rect.left;
        const cssY = clientY - rect.top;
        return this.screenToWorld({ x: cssX, y: cssY });
    },

    setupCanvas() {
        const canvas = this.elements.canvas;
        const rect = canvas.getBoundingClientRect();
        
        const cssW = Math.floor(rect.width);
        const cssH = Math.floor(rect.height);
        const dpr = window.devicePixelRatio || 1;

        this.state.cssWidth = cssW;
        this.state.cssHeight = cssH;
        this.state.dpr = dpr;

        canvas.width = Math.floor(cssW * dpr);  
        canvas.height = Math.floor(cssH * dpr);

        this.elements.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const desiredCells = 14;                        
        const pixelsPerCell = Math.min(cssW, cssH) / desiredCells;
        this.viewport.scale = pixelsPerCell / this.config.worldGridSize;
        this.draw();
    },

    clear() {
        const ctx = this.elements.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);
        ctx.restore();
    },

    draw() {
        this.clear();
        this.drawGridAndAxes();
        this.drawVector({ x: 0, y: 0 }, this.state.point);
        this.drawPoint(this.state.point);
        this.drawLabels();
    },

    drawGridAndAxes() {
        const ctx = this.elements.ctx;
        const bounds = this.worldBounds();

        // major grid lines in world units step = worldGridSize
        const g = this.config.worldGridSize;

        // vertical grid lines
        ctx.beginPath();
        ctx.lineWidth = Math.max(1 / this.state.dpr, 0.5); // visually ~1 device px
        ctx.strokeStyle = this.config.gridColor;

        // compute first vertical line at multiple of g
        let startX = Math.floor(bounds.left / g) * g;
        for (let x = startX; x <= bounds.right; x += g) {
            // skip axis (drawed separately)
            if (Math.abs(x) < 1e-9) continue;
            const p1 = this.worldToScreen({ x: x, y: bounds.bottom });
            const p2 = this.worldToScreen({ x: x, y: bounds.top });
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        }

        // horizontal grid lines
        let startY = Math.floor(bounds.bottom / g) * g;
        for (let y = startY; y <= bounds.top; y += g) {
            if (Math.abs(y) < 1e-9) continue;
            const p1 = this.worldToScreen({ x: bounds.left, y: y });
            const p2 = this.worldToScreen({ x: bounds.right, y: y });
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        }

        ctx.stroke();

        // axes (x=0 and y=0)
        ctx.beginPath();
        ctx.lineWidth = Math.max(2 / this.state.dpr, 1);
        ctx.strokeStyle = this.config.axisColor;

        // x-axis
        const xa1 = this.worldToScreen({ x: bounds.left, y: 0 });
        const xa2 = this.worldToScreen({ x: bounds.right, y: 0 });
        ctx.moveTo(xa1.x, xa1.y);
        ctx.lineTo(xa2.x, xa2.y);

        // y-axis
        const ya1 = this.worldToScreen({ x: 0, y: bounds.bottom });
        const ya2 = this.worldToScreen({ x: 0, y: bounds.top });
        ctx.moveTo(ya1.x, ya1.y);
        ctx.lineTo(ya2.x, ya2.y);

        ctx.stroke();
    },

    drawLabels() {
        // draw numeric tick labels and axis titles using device-space fonts for crisp text
        const ctx = this.elements.ctx;
        const dpr = this.state.dpr;
        const bounds = this.worldBounds();
        const g = this.config.worldGridSize;
        const buffer = 10; 

        // switch to identity transform (device pixels)
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // fonts in device px (so multiply by dpr)
        ctx.fillStyle = this.config.labelColor;
        ctx.font = `${14 * dpr}px "Segoe UI", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let x = Math.floor(bounds.left / g) * g; x <= bounds.right; x += g) {
            if (x === 0) continue;
            const scr = this.worldToScreen({ x, y: 0 });
            // Only draw if within buffer
            if (scr.x > buffer && scr.x < this.state.cssWidth - buffer) {
                const devX = scr.x * this.state.dpr;
                const devY = scr.y * this.state.dpr;
                ctx.fillText(String(x), devX, devY + 12 * this.state.dpr);
            }
        }

        // Y-axis labels
        for (let y = Math.floor(bounds.bottom / g) * g; y <= bounds.top; y += g) {
            if (y === 0) continue;
            const scr = this.worldToScreen({ x: 0, y });
            if (scr.y > buffer && scr.y < this.state.cssHeight - buffer) {
                const devX = scr.x * this.state.dpr;
                const devY = scr.y * this.state.dpr;
                ctx.fillText(String(y), devX + 18 * this.state.dpr, devY);
            }
        }

        // Axis titles
        ctx.font = `bold ${16 * dpr}px "Segoe UI", system-ui, sans-serif`;
        ctx.fillStyle = this.config.axisColor;
        // X title (bottom-right)
        const xt = this.worldToScreen({ x: bounds.right - g / 2, y: 0 });
        ctx.fillText("X", xt.x * dpr, (xt.y - 22) * dpr);

        // Y title (top-left)
        const yt = this.worldToScreen({ x: 0, y: bounds.top - g / 2 });
        ctx.fillText("Y", (yt.x - 16) * dpr, yt.y * dpr);

        ctx.restore();

    },

    drawVector(from, to, color = this.config.vectorColor) {
        const ctx = this.elements.ctx;
        // compute arrow properties in device pixels so it appears constant
        const dpr = this.state.dpr;
        const headDevicePx = 12;          // arrowhead size in device px
        const headWorld = headDevicePx / (this.viewport.scale * dpr); // in world units
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const proj = headWorld * Math.cos(Math.PI / 6);

        const lineEnd = {
            x: to.x - proj * Math.cos(angle),
            y: to.y - proj * Math.sin(angle)
        };

        // draw line (in CSS px coordinates)
        const pFrom = this.worldToScreen(from);
        const pLineEnd = this.worldToScreen(lineEnd);

        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        ctx.lineTo(pLineEnd.x, pLineEnd.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(3 / this.state.dpr, 1);
        ctx.lineCap = "round";
        ctx.stroke();

        // arrowhead (filled triangle)
        const tip = this.worldToScreen(to);
        const a1 = {
            x: to.x - headWorld * Math.cos(angle - Math.PI / 6),
            y: to.y - headWorld * Math.sin(angle - Math.PI / 6)
        };
        const a2 = {
            x: to.x - headWorld * Math.cos(angle + Math.PI / 6),
            y: to.y - headWorld * Math.sin(angle + Math.PI / 6)
        };
        const pa1 = this.worldToScreen(a1);
        const pa2 = this.worldToScreen(a2);

        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(pa1.x, pa1.y);
        ctx.lineTo(pa2.x, pa2.y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    },

    drawPoint(worldPt) {
        // draw point as device-crisp circle; radius in CSS px but account for DPR for crispness
        const ctx = this.elements.ctx;
        const scr = this.worldToScreen(worldPt);
        ctx.save();
        // draw in CSS px (ctx currently set to DPR scaling) -> that's OK for circles
        ctx.beginPath();
        ctx.fillStyle = this.config.pointColor;
        ctx.arc(scr.x, scr.y, this.config.pointSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = Math.max(1 / this.state.dpr, 0.5);
        ctx.strokeStyle = "#00000033";
        ctx.stroke();
        ctx.restore();
    },

    worldBounds() {
        const halfW = (this.state.cssWidth / 2) / this.viewport.scale;
        const halfH = (this.state.cssHeight / 2) / this.viewport.scale;
        return {
            left: this.viewport.center.x - halfW,
            right: this.viewport.center.x + halfW,
            top: this.viewport.center.y + halfH,
            bottom: this.viewport.center.y - halfH
        };
    },

    attachEvents() {
        // pointer events for dragging point / panning
        const canvas = this.elements.canvas;

        canvas.style.touchAction = "none";

        canvas.addEventListener("pointerdown", (ev) => {
            canvas.setPointerCapture(ev.pointerId);
            this.state.pointerId = ev.pointerId;
            const world = this.clientToWorld(ev.clientX, ev.clientY);
            // hit-test point by distance in CSS px
            const dx = (world.x - this.state.point.x) * this.viewport.scale;
            const dy = (world.y - this.state.point.y) * this.viewport.scale;
            const distCss = Math.hypot(dx, dy);
            if (distCss <= this.config.pointSize * 1.5) {
                this.state.draggingPoint = true;
            } else {
                this.state.draggingPan = true;
            }
            this.state.lastPointer = { x: ev.clientX, y: ev.clientY };
        });

        window.addEventListener("pointermove", (ev) => {
            // ignore if not active pointer
            if (this.state.pointerId !== ev.pointerId) return;
            if (!this.state.draggingPoint && !this.state.draggingPan) return;

            const last = this.state.lastPointer;
            const dxClient = ev.clientX - last.x;
            const dyClient = ev.clientY - last.y;
            this.state.lastPointer = { x: ev.clientX, y: ev.clientY };

            if (this.state.draggingPoint) {
                // move point to pointer world coordinates
                const world = this.clientToWorld(ev.clientX, ev.clientY);
                this.state.point.x = world.x;
                this.state.point.y = world.y;
                this.draw();
            } else if (this.state.draggingPan) {
                // pan viewport center by negative delta in world coordinates
                // dxClient is CSS px; convert to world units by dividing by scale
                const cssDx = dxClient;
                const cssDy = dyClient;
                this.viewport.center.x -= cssDx / this.viewport.scale;
                this.viewport.center.y += cssDy / this.viewport.scale;
                this.draw();
            }
        });

        window.addEventListener("pointerup", (ev) => {
            if (this.state.pointerId !== ev.pointerId) return;
            this.state.draggingPoint = false;
            this.state.draggingPan = false;
            try { canvas.releasePointerCapture(ev.pointerId); } catch (e) {}
            this.state.pointerId = null;
            this.state.lastPointer = null;
        });

        window.addEventListener("pointercancel", () => {
            this.state.draggingPoint = false;
            this.state.draggingPan = false;
            this.state.pointerId = null;
            this.state.lastPointer = null;
        });

        // wheel zoom (zoom centered on cursor)
        canvas.addEventListener("wheel", (ev) => {
            ev.preventDefault();

            const zoomIntensity = 0.0018; // tweak for comfortable zoom speed
            // wheel deltaY: positive = scroll down (zoom out), negative = zoom in
            const wheel = ev.deltaY;
            const factor = Math.exp(-wheel * zoomIntensity);

            const rect = canvas.getBoundingClientRect();
            const cssX = ev.clientX - rect.left;
            const cssY = ev.clientY - rect.top;

            // world coordinate under cursor before zoom
            const before = this.screenToWorld({ x: cssX, y: cssY });

            // apply scale clamp
            const minScale = 0.02; // smallest CSS px per world unit
            const maxScale = 200;  // largest
            this.viewport.scale = Math.max(minScale, Math.min(maxScale, this.viewport.scale * factor));

            // world coordinate under cursor after zoom should be same -> update center
            const after = this.screenToWorld({ x: cssX, y: cssY });

            // shift center by (before - after)
            this.viewport.center.x += (before.x - after.x);
            this.viewport.center.y += (before.y - after.y);

            this.draw();
        }, { passive: false });

        // window setupCanvas
        window.addEventListener("resize", () => {
            // small debounce (simple)
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this.setupCanvas(), 50);
        });
    }
};

document.addEventListener("DOMContentLoaded", () => VectorApp.init());

