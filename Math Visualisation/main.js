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
        labelColor: "#cbd5e1",

        // Tiny Steps: the math uses a circle of radius 1;
        // on screen, 1 unit is drawn as 200 world units (4 grid cells)
        unitRadius: 200,
        circleColor: "#64748b",
        heightColor: "#facc15"
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
        dpr: 1,

        project: "coordinates",

        // Tiny Steps state, in unit-circle (math) coordinates
        tiny: {
            theta: 1,
            steps: 20,
            h: 0.05,
            step: 0,
            x: 1,
            y: 0,
            path: [{ x: 1, y: 0 }],
            timer: null
        }
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
        this.setupProjectControls();
        this.draw();
    },

    setupProjectControls() {
        const select = document.getElementById("project-select");
        const thetaInput = document.getElementById("theta-input");
        const stepsInput = document.getElementById("steps-input");

        const applyProject = () => {
            this.stopTinyRun();
            this.state.project = select.value;
            document.getElementById("coordinate-controls").hidden = select.value !== "coordinates";
            document.getElementById("tiny-step-controls").hidden = select.value !== "tiny-steps";
            this.elements.heading.textContent = select.options[select.selectedIndex].text;
            this.draw();
        };

        select.addEventListener("change", applyProject);
        thetaInput.addEventListener("input", () => this.resetTinySteps());
        stepsInput.addEventListener("input", () => this.resetTinySteps());

        document.getElementById("reset-steps").addEventListener("click", () => this.resetTinySteps());
        document.getElementById("next-step").addEventListener("click", () => {
            this.stopTinyRun();
            this.takeTinyStep();
            this.updateTinyReadout();
            this.draw();
        });
        document.getElementById("run-steps").addEventListener("click", () => this.runTinySteps());

        this.resetTinySteps();
        applyProject();
    },

    // Start again at (1, 0): zero radians of travel
    resetTinySteps() {
        this.stopTinyRun();
        const t = this.state.tiny;

        t.theta = Number(document.getElementById("theta-input").value) || 0;
        t.steps = Math.max(1, Math.floor(Number(document.getElementById("steps-input").value) || 1));

        // split θ into equal tiny pieces of travel
        t.h = t.theta / t.steps;

        t.step = 0;
        t.x = 1;
        t.y = 0;
        t.path = [{ x: 1, y: 0 }];

        this.updateTinyReadout();
        this.draw();
    },

    // One tiny straight movement: R_new = R + h·V, with V = (−y, x)
    takeTinyStep() {
        const t = this.state.tiny;
        if (t.step >= t.steps) return;

        // perpendicular direction, computed from the CURRENT point
        // (both new coordinates must use the old x and y)
        const vx = -t.y;
        const vy = t.x;

        t.x = t.x + t.h * vx;   // x_new = x − h·y
        t.y = t.y + t.h * vy;   // y_new = y + h·x

        t.step += 1;
        t.path.push({ x: t.x, y: t.y });
    },

    // Play the remaining steps, about 3 seconds in total
    runTinySteps() {
        const t = this.state.tiny;
        if (t.timer !== null || t.step >= t.steps) return;

        const stepsPerTick = Math.max(1, Math.ceil(t.steps / 180));
        const delay = Math.max(16, 3000 / t.steps);

        t.timer = setInterval(() => {
            for (let i = 0; i < stepsPerTick; i++) this.takeTinyStep();
            this.updateTinyReadout();
            this.draw();
            if (t.step >= t.steps) this.stopTinyRun();
        }, delay);
    },

    stopTinyRun() {
        clearInterval(this.state.tiny.timer);
        this.state.tiny.timer = null;
    },

    updateTinyReadout() {
        const t = this.state.tiny;
        const squaredLength = t.x * t.x + t.y * t.y;

        document.getElementById("step-value").textContent = `${t.step} / ${t.steps}`;
        document.getElementById("h-value").textContent = t.h.toFixed(5);
        document.getElementById("point-value").textContent = `(${t.x.toFixed(5)}, ${t.y.toFixed(5)})`;
        document.getElementById("length-value").textContent = squaredLength.toFixed(5);
        document.getElementById("error-value").textContent = (squaredLength - 1).toFixed(5);
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
        if (this.state.project === "tiny-steps") {
            this.drawTinySteps();
        } else {
            this.drawVector({ x: 0, y: 0 }, this.state.point);
            this.drawPoint(this.state.point);
        }
        this.drawLabels();
    },

    drawTinySteps() {
        const ctx = this.elements.ctx;
        const t = this.state.tiny;
        const r = this.config.unitRadius;

        // unit-circle coordinates → world coordinates
        const toWorld = (p) => ({ x: p.x * r, y: p.y * r });

        // reference circle x² + y² = 1 (only for comparison, not used in the steps)
        const center = this.worldToScreen({ x: 0, y: 0 });
        ctx.beginPath();
        ctx.arc(center.x, center.y, r * this.viewport.scale, 0, Math.PI * 2);
        ctx.strokeStyle = this.config.circleColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // the straight tiny steps taken so far
        ctx.beginPath();
        t.path.forEach((p, i) => {
            const s = this.worldToScreen(toWorld(p));
            if (i === 0) ctx.moveTo(s.x, s.y);
            else ctx.lineTo(s.x, s.y);
        });
        ctx.strokeStyle = this.config.pointColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // where each step ended
        if (t.steps <= 200) {
            ctx.fillStyle = this.config.pointColor;
            t.path.forEach((p) => {
                const s = this.worldToScreen(toWorld(p));
                ctx.beginPath();
                ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        const current = toWorld({ x: t.x, y: t.y });

        // the vertical coordinate y: drop from the point to the x-axis
        const top = this.worldToScreen(current);
        const foot = this.worldToScreen({ x: current.x, y: 0 });
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(foot.x, foot.y);
        ctx.strokeStyle = this.config.heightColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // radius R = (x, y)
        this.drawVector({ x: 0, y: 0 }, current);

        // next direction V = (−y, x), drawn from the point at full length
        if (t.step < t.steps) {
            const tip = toWorld({ x: t.x - t.y, y: t.y + t.x });
            this.drawVector(current, tip, "#ff6b6b80");
        }

        this.drawPoint(current);
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
            if (this.state.project === "coordinates" && distCss <= this.config.pointSize * 1.5) {
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

            const previousPointer = this.state.lastPointer;

            // 1. how far the pointer moved since the previous event, in CSS px (canvas y grows downward)
            const pointerMoveX = ev.clientX - previousPointer.x;
            const pointerMoveY = ev.clientY - previousPointer.y;
            this.state.lastPointer = { x: ev.clientX, y: ev.clientY };

            if (this.state.draggingPoint) {
                // move point to pointer world coordinates
                const world = this.clientToWorld(ev.clientX, ev.clientY);
                this.state.point.x = world.x;
                this.state.point.y = world.y;
                this.draw();
            } else if (this.state.draggingPan) {
                // 2. the same movement in world units (world y grows upward, so y flips)
                const worldMoveX = pointerMoveX / this.viewport.scale;
                const worldMoveY = -pointerMoveY / this.viewport.scale;

                // 3. the camera moves the opposite way, so the world appears to follow the pointer
                const cameraMoveX = -worldMoveX;
                const cameraMoveY = -worldMoveY;

                // 4. new camera = old camera + camera move
                this.viewport.center.x = this.viewport.center.x + cameraMoveX;
                this.viewport.center.y = this.viewport.center.y + cameraMoveY;

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
            // stop the browser from scrolling the page (needs { passive: false } below)
            ev.preventDefault();

            // 1. turn the wheel movement into a zoom factor
            //    ev.deltaY: pixels scrolled in this event (negative = up, positive = down, about ±100 per mouse notch)
            //    every pixel up multiplies the scale by zoomPerPixel once, every pixel down divides by it once:
            //    n pixels up = zoomPerPixel multiplied n times = zoomPerPixel^n, n pixels down = zoomPerPixel^-n
            const zoomPerPixel = 1.0018;
            const zoomFactor = Math.pow(zoomPerPixel, -ev.deltaY);

            // 2. where the pointer is on the canvas, in CSS px
            const rect = canvas.getBoundingClientRect();
            const pointerX = ev.clientX - rect.left;
            const pointerY = ev.clientY - rect.top;

            // 3. the world point at the pointer, converted with the OLD scale
            const worldPointOldScale = this.screenToWorld({ x: pointerX, y: pointerY });

            // 4. new scale, kept between the limits
            const minScale = 0.02;
            const maxScale = 200;
            const newScale = this.viewport.scale * zoomFactor;
            this.viewport.scale = Math.max(minScale, Math.min(maxScale, newScale));

            // 5. the same pointer converted again: screenToWorld now uses the NEW scale (camera not moved yet)
            const worldPointNewScale = this.screenToWorld({ x: pointerX, y: pointerY });

            // 6. camera move that makes the pointer show worldPointOldScale again (old − new)
            const cameraMoveX = worldPointOldScale.x - worldPointNewScale.x;
            const cameraMoveY = worldPointOldScale.y - worldPointNewScale.y;

            // 7. new camera = old camera + camera move
            this.viewport.center.x = this.viewport.center.x + cameraMoveX;
            this.viewport.center.y = this.viewport.center.y + cameraMoveY;

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

