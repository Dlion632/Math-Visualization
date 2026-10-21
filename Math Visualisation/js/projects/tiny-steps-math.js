"use strict";

// tiny-steps-math.js — the tiny-step rule from the notes.
//
// Only numbers live here: no canvas, no pixels, no world units,
// and no Math.sin or Math.cos. Points are in unit-circle
// coordinates, so the start (1, 0) is exactly on the circle.

// Split θ radians of travel into equal tiny pieces.
export function stepSize(theta, steps) {
    return theta / steps;
}

// The direction across the radius R = (x, y):
// V = (−y, x), because R · V = x(−y) + yx = 0.
export function perpendicular(p) {
    return { x: -p.y, y: p.x };
}

// One tiny straight movement: R_new = R + h·V
//   x_new = x − h·y
//   y_new = y + h·x
// V is computed from the old point first, so both new
// coordinates use the old x and y.
export function tinyStep(p, h) {
    const v = perpendicular(p);
    return {
        x: p.x + h * v.x,
        y: p.y + h * v.y
    };
}

// x² + y²: exactly 1 on the circle, 1 + h² after one step from it.
export function squaredLength(p) {
    return p.x * p.x + p.y * p.y;
}
