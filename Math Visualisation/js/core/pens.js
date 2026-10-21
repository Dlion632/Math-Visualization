"use strict";

// pens.js — the tools a project uses to draw ON the coordinate system.
//
// Every pen takes WORLD coordinates. It converts them to screen
// pixels itself, so a project never has to think about pixels,
// panning or zooming.
//
// Each pen saves and restores the canvas settings, so one drawing
// never changes the colour or line style of the next.

import { view, worldToScreen } from "./view.js";

export function drawPoint(worldPoint, color = "#ff6b6b", size = 6) {
    const ctx = view.ctx;
    const scr = worldToScreen(worldPoint);

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(scr.x, scr.y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = Math.max(1 / view.dpr, 0.5);
    ctx.strokeStyle = "#00000033";
    ctx.stroke();
    ctx.restore();
}

export function drawLine(from, to, color, width = 2, dash = []) {
    const ctx = view.ctx;
    const a = worldToScreen(from);
    const b = worldToScreen(to);

    ctx.save();
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}

// A chain of straight lines through the points, in order.
export function drawPath(worldPoints, color, width = 2) {
    const ctx = view.ctx;

    ctx.save();
    ctx.beginPath();
    worldPoints.forEach((p, i) => {
        const s = worldToScreen(p);
        if (i === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}

// radius is in world units
export function drawCircle(center, radius, color, width = 1.5) {
    const ctx = view.ctx;
    const c = worldToScreen(center);

    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius * view.scale, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}

// An arrow from `from` to `to`. The arrowhead keeps the same size
// on screen at every zoom level.
export function drawVector(from, to, color = "#4cc9f0") {
    const ctx = view.ctx;
    const headDevicePx = 12;
    const headWorld = headDevicePx / (view.scale * view.dpr);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const proj = headWorld * Math.cos(Math.PI / 6);

    // stop the line where the arrowhead begins
    const lineEnd = {
        x: to.x - proj * Math.cos(angle),
        y: to.y - proj * Math.sin(angle)
    };

    const pFrom = worldToScreen(from);
    const pLineEnd = worldToScreen(lineEnd);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pFrom.x, pFrom.y);
    ctx.lineTo(pLineEnd.x, pLineEnd.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(3 / view.dpr, 1);
    ctx.lineCap = "round";
    ctx.stroke();

    // arrowhead (filled triangle)
    const tip = worldToScreen(to);
    const a1 = worldToScreen({
        x: to.x - headWorld * Math.cos(angle - Math.PI / 6),
        y: to.y - headWorld * Math.sin(angle - Math.PI / 6)
    });
    const a2 = worldToScreen({
        x: to.x - headWorld * Math.cos(angle + Math.PI / 6),
        y: to.y - headWorld * Math.sin(angle + Math.PI / 6)
    });

    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(a1.x, a1.y);
    ctx.lineTo(a2.x, a2.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}
