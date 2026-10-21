"use strict";

// view.js — the "camera" of the coordinate system.
//
// The world is an endless flat plane measured in world units.
// The canvas shows a window onto that plane. This file remembers
// where the window is (center), how much it is magnified (scale),
// and converts between world coordinates and screen pixels.
//
// Nothing is drawn here.

export const view = {
    canvas: null,
    ctx: null,

    center: { x: 0, y: 0 },   // the world point shown in the middle of the canvas
    scale: 1,                 // CSS pixels per world unit
    gridSize: 50,             // world units between grid lines

    cssWidth: 0,
    cssHeight: 0,
    dpr: 1
};

export function setupView(canvas) {
    view.canvas = canvas;
    view.ctx = canvas.getContext("2d");
}

// Match the canvas to its size on the page, and reset the zoom
// so that about 14 grid cells fit across the shorter side.
export function resizeView() {
    const canvas = view.canvas;
    const rect = canvas.getBoundingClientRect();

    const cssW = Math.floor(rect.width);
    const cssH = Math.floor(rect.height);
    const dpr = window.devicePixelRatio || 1;

    view.cssWidth = cssW;
    view.cssHeight = cssH;
    view.dpr = dpr;

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const desiredCells = 14;
    const pixelsPerCell = Math.min(cssW, cssH) / desiredCells;
    view.scale = pixelsPerCell / view.gridSize;
}

// world → screen: shift so the view center is at 0, magnify,
// then move 0 to the middle of the canvas. Screen y grows downward,
// world y grows upward, so y is flipped.
export function worldToScreen(worldPoint) {
    const screenX = (worldPoint.x - view.center.x) * view.scale + view.cssWidth / 2;
    const screenY = view.cssHeight / 2 - (worldPoint.y - view.center.y) * view.scale;
    return { x: screenX, y: screenY };
}

// screen → world: the same steps in reverse order.
export function screenToWorld(screenPoint) {
    const worldX = (screenPoint.x - view.cssWidth / 2) / view.scale + view.center.x;
    const worldY = (view.cssHeight / 2 - screenPoint.y) / view.scale + view.center.y;
    return { x: worldX, y: worldY };
}

// Mouse positions are measured from the browser window,
// so first make them relative to the canvas.
export function clientToWorld(clientX, clientY) {
    const rect = view.canvas.getBoundingClientRect();
    return screenToWorld({ x: clientX - rect.left, y: clientY - rect.top });
}

// The part of the world that is currently visible.
export function worldBounds() {
    const halfW = (view.cssWidth / 2) / view.scale;
    const halfH = (view.cssHeight / 2) / view.scale;
    return {
        left: view.center.x - halfW,
        right: view.center.x + halfW,
        top: view.center.y + halfH,
        bottom: view.center.y - halfH
    };
}

export function clearCanvas() {
    const ctx = view.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, view.canvas.width, view.canvas.height);
    ctx.restore();
}
