"use strict";

// coordinates.js — the "Coordinate System" project:
// one point you can drag, with a vector from the origin to it.

import { view } from "../core/view.js";
import { drawPoint, drawVector } from "../core/pens.js";

const POINT_SIZE = 6;
const point = { x: 90, y: -120 };   // world coordinates

export const coordinatesProject = {
    draw() {
        drawVector({ x: 0, y: 0 }, point);
        drawPoint(point, "#ff6b6b", POINT_SIZE);
    },

    // Grab the point if the mouse is close to it on screen.
    // world distance × scale = distance in pixels
    grab(world) {
        const dx = (world.x - point.x) * view.scale;
        const dy = (world.y - point.y) * view.scale;
        return Math.hypot(dx, dy) <= POINT_SIZE * 1.5;
    },

    drag(world) {
        point.x = world.x;
        point.y = world.y;
    }
};
