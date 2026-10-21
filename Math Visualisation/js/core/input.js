"use strict";

// input.js — what the mouse (or finger) does to the coordinate system.
//
//   drag empty space          → pan the view
//   scroll                    → zoom around the cursor
//   drag something grabbable  → the current project moves it
//
// A project makes something grabbable by having two functions:
//   grab(worldPoint)  → return true if it wants this drag
//   drag(worldPoint)  → move the grabbed thing there

import { view, screenToWorld, clientToWorld } from "./view.js";

export function setupInput(getProject, redraw) {
    const canvas = view.canvas;
    canvas.style.touchAction = "none";

    let dragging = null;      // null, "pan" or "project"
    let pointerId = null;
    let lastPointer = null;

    canvas.addEventListener("pointerdown", (ev) => {
        canvas.setPointerCapture(ev.pointerId);
        pointerId = ev.pointerId;
        lastPointer = { x: ev.clientX, y: ev.clientY };

        const project = getProject();
        const world = clientToWorld(ev.clientX, ev.clientY);

        if (project.grab && project.grab(world)) {
            dragging = "project";
        } else {
            dragging = "pan";
        }
    });

    window.addEventListener("pointermove", (ev) => {
        if (ev.pointerId !== pointerId || dragging === null) return;

        const dxClient = ev.clientX - lastPointer.x;
        const dyClient = ev.clientY - lastPointer.y;
        lastPointer = { x: ev.clientX, y: ev.clientY };

        if (dragging === "project") {
            getProject().drag(clientToWorld(ev.clientX, ev.clientY));
        } else {
            // move the view the opposite way to the mouse:
            // pixels ÷ scale = world units
            view.center.x -= dxClient / view.scale;
            view.center.y += dyClient / view.scale;
        }
        redraw();
    });

    const stopDragging = () => {
        dragging = null;
        pointerId = null;
        lastPointer = null;
    };

    window.addEventListener("pointerup", (ev) => {
        if (ev.pointerId !== pointerId) return;
        try { canvas.releasePointerCapture(ev.pointerId); } catch (e) {}
        stopDragging();
    });

    window.addEventListener("pointercancel", stopDragging);

    // zoom so that the world point under the cursor stays under the cursor
    canvas.addEventListener("wheel", (ev) => {
        ev.preventDefault();

        const zoomIntensity = 0.0018;
        const factor = Math.exp(-ev.deltaY * zoomIntensity);

        const rect = canvas.getBoundingClientRect();
        const cursor = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };

        const before = screenToWorld(cursor);

        const minScale = 0.02;
        const maxScale = 200;
        view.scale = Math.max(minScale, Math.min(maxScale, view.scale * factor));

        const after = screenToWorld(cursor);

        // shift the center by the difference, so the cursor point is back in place
        view.center.x += before.x - after.x;
        view.center.y += before.y - after.y;

        redraw();
    }, { passive: false });
}
