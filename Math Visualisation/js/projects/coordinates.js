"use strict";

// coordinates.js — the "Coordinate System" project:
// one point you can drag, with a vector from the origin to it.
//
// Follows the lifecycle in project-template.js.

import { view } from "../core/view.js";
import { drawPoint, drawVector } from "../core/pens.js";

// ── 1. State ──────────────────────────────────────────────────

const POINT_SIZE = 6;

const state = {
    point: { x: 90, y: -120 }   // world coordinates
};

// ── 2. Helpers ────────────────────────────────────────────────

// Is the mouse within a few pixels of the point?
// world distance × scale = distance in pixels
function isNearPoint(world) {
    const dx = (world.x - state.point.x) * view.scale;
    const dy = (world.y - state.point.y) * view.scale;
    return Math.hypot(dx, dy) <= POINT_SIZE * 1.5;
}

// ── 3. Lifecycle ──────────────────────────────────────────────

export const coordinatesProject = {
    panel: "coordinate-controls",

    setup() {
        // no buttons to connect
    },

    enter() {
    },

    update(dt) {
        // nothing moves on its own
    },

    draw() {
        drawVector({ x: 0, y: 0 }, state.point);
        drawPoint(state.point, "#ff6b6b", POINT_SIZE);
    },

    leave() {
    },

    grab(world) {
        return isNearPoint(world);
    },

    drag(world) {
        state.point = { x: world.x, y: world.y };
    }
};
