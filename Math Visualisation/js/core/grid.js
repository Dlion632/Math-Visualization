"use strict";

// grid.js — draws the coordinate system itself:
// grid lines, the two axes, and the numbers along them.
//
// It is drawn in two parts so that the numbers can sit on top
// of whatever a project draws:
//   drawGrid()        → before the project
//   drawGridLabels()  → after the project

import { view, worldToScreen, worldBounds } from "./view.js";

const colors = {
    axis: "#4cc9f0",
    grid: "#334155",
    label: "#cbd5e1"
};

export function drawGrid() {
    const ctx = view.ctx;
    const bounds = worldBounds();
    const g = view.gridSize;

    // grid lines, every g world units
    ctx.beginPath();
    ctx.lineWidth = Math.max(1 / view.dpr, 0.5); // visually ~1 device px
    ctx.strokeStyle = colors.grid;

    // vertical lines, starting at the first multiple of g on the left
    const startX = Math.floor(bounds.left / g) * g;
    for (let x = startX; x <= bounds.right; x += g) {
        if (Math.abs(x) < 1e-9) continue; // the axis is drawn separately
        const p1 = worldToScreen({ x: x, y: bounds.bottom });
        const p2 = worldToScreen({ x: x, y: bounds.top });
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }

    // horizontal lines
    const startY = Math.floor(bounds.bottom / g) * g;
    for (let y = startY; y <= bounds.top; y += g) {
        if (Math.abs(y) < 1e-9) continue;
        const p1 = worldToScreen({ x: bounds.left, y: y });
        const p2 = worldToScreen({ x: bounds.right, y: y });
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }

    ctx.stroke();

    // axes (y = 0 and x = 0)
    ctx.beginPath();
    ctx.lineWidth = Math.max(2 / view.dpr, 1);
    ctx.strokeStyle = colors.axis;

    const xa1 = worldToScreen({ x: bounds.left, y: 0 });
    const xa2 = worldToScreen({ x: bounds.right, y: 0 });
    ctx.moveTo(xa1.x, xa1.y);
    ctx.lineTo(xa2.x, xa2.y);

    const ya1 = worldToScreen({ x: 0, y: bounds.bottom });
    const ya2 = worldToScreen({ x: 0, y: bounds.top });
    ctx.moveTo(ya1.x, ya1.y);
    ctx.lineTo(ya2.x, ya2.y);

    ctx.stroke();
}

export function drawGridLabels() {
    // text is drawn in device pixels so it stays crisp
    const ctx = view.ctx;
    const dpr = view.dpr;
    const bounds = worldBounds();
    const g = view.gridSize;
    const buffer = 10;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = colors.label;
    ctx.font = `${14 * dpr}px "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // numbers under the x-axis
    for (let x = Math.floor(bounds.left / g) * g; x <= bounds.right; x += g) {
        if (x === 0) continue;
        const scr = worldToScreen({ x, y: 0 });
        if (scr.x > buffer && scr.x < view.cssWidth - buffer) {
            ctx.fillText(String(x), scr.x * dpr, scr.y * dpr + 12 * dpr);
        }
    }

    // numbers next to the y-axis
    for (let y = Math.floor(bounds.bottom / g) * g; y <= bounds.top; y += g) {
        if (y === 0) continue;
        const scr = worldToScreen({ x: 0, y });
        if (scr.y > buffer && scr.y < view.cssHeight - buffer) {
            ctx.fillText(String(y), scr.x * dpr + 18 * dpr, scr.y * dpr);
        }
    }

    // axis titles
    ctx.font = `bold ${16 * dpr}px "Segoe UI", system-ui, sans-serif`;
    ctx.fillStyle = colors.axis;

    const xt = worldToScreen({ x: bounds.right - g / 2, y: 0 });
    ctx.fillText("X", xt.x * dpr, (xt.y - 22) * dpr);

    const yt = worldToScreen({ x: 0, y: bounds.top - g / 2 });
    ctx.fillText("Y", (yt.x - 16) * dpr, yt.y * dpr);

    ctx.restore();
}
