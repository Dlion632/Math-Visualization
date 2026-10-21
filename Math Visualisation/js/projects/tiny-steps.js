"use strict";

// tiny-steps.js — the "Sine — Tiny Steps" project.
//
// It connects the math to the screen in three stages:
//   1. math:   tiny-steps-math.js moves a point in unit-circle coordinates
//   2. world:  toWorld() makes the circle 200 world units big (4 grid cells)
//   3. screen: the pens turn world coordinates into pixels

import { drawCircle, drawLine, drawPath, drawPoint, drawVector } from "../core/pens.js";
import { stepSize, perpendicular, tinyStep, squaredLength } from "./tiny-steps-math.js";

// 1 math unit = 200 world units, so the circle is large enough to see
const UNIT = 200;

function toWorld(p) {
    return { x: p.x * UNIT, y: p.y * UNIT };
}

const colors = {
    circle: "#64748b",
    path: "#ff6b6b",
    direction: "#ff6b6b80",
    height: "#facc15"
};

const state = {
    theta: 1,
    steps: 20,
    h: 0.05,
    step: 0,                    // how many steps taken so far
    point: { x: 1, y: 0 },      // current point, unit-circle coordinates
    path: [{ x: 1, y: 0 }],     // every point visited
    timer: null
};

let redraw = () => {};

// Start again at (1, 0): zero radians of travel.
function reset() {
    stop();
    state.theta = Number(document.getElementById("theta-input").value) || 0;
    state.steps = Math.max(1, Math.floor(Number(document.getElementById("steps-input").value) || 1));
    state.h = stepSize(state.theta, state.steps);

    state.step = 0;
    state.point = { x: 1, y: 0 };
    state.path = [state.point];

    updateReadout();
    redraw();
}

function takeStep() {
    if (state.step >= state.steps) return;
    state.point = tinyStep(state.point, state.h);
    state.path.push(state.point);
    state.step += 1;
}

// Play the remaining steps in about 3 seconds.
function run() {
    if (state.timer !== null || state.step >= state.steps) return;

    const stepsPerTick = Math.max(1, Math.ceil(state.steps / 180));
    const delay = Math.max(16, 3000 / state.steps);

    state.timer = setInterval(() => {
        for (let i = 0; i < stepsPerTick; i++) takeStep();
        updateReadout();
        redraw();
        if (state.step >= state.steps) stop();
    }, delay);
}

function stop() {
    clearInterval(state.timer);
    state.timer = null;
}

function updateReadout() {
    const p = state.point;
    const len2 = squaredLength(p);

    document.getElementById("step-value").textContent = `${state.step} / ${state.steps}`;
    document.getElementById("h-value").textContent = state.h.toFixed(5);
    document.getElementById("point-value").textContent = `(${p.x.toFixed(5)}, ${p.y.toFixed(5)})`;
    document.getElementById("length-value").textContent = len2.toFixed(5);
    document.getElementById("error-value").textContent = (len2 - 1).toFixed(5);
}

export const tinyStepsProject = {
    setup(redrawFunction) {
        redraw = redrawFunction;

        document.getElementById("theta-input").addEventListener("input", reset);
        document.getElementById("steps-input").addEventListener("input", reset);
        document.getElementById("reset-steps").addEventListener("click", reset);
        document.getElementById("next-step").addEventListener("click", () => {
            stop();
            takeStep();
            updateReadout();
            redraw();
        });
        document.getElementById("run-steps").addEventListener("click", run);

        reset();
    },

    stop,

    draw() {
        const origin = { x: 0, y: 0 };
        const current = toWorld(state.point);

        // reference circle x² + y² = 1 (for comparison only, not used in the steps)
        drawCircle(origin, UNIT, colors.circle, 1.5);

        // the straight tiny steps taken so far
        drawPath(state.path.map(toWorld), colors.path, 2);
        if (state.steps <= 200) {
            state.path.forEach((p) => drawPoint(toWorld(p), colors.path, 2.5));
        }

        // the vertical coordinate y: drop from the point to the x-axis
        drawLine(current, { x: current.x, y: 0 }, colors.height, 2, [6, 5]);

        // radius R = (x, y)
        drawVector(origin, current);

        // next direction V = (−y, x), drawn from the point at full length
        if (state.step < state.steps) {
            const v = perpendicular(state.point);
            drawVector(current, toWorld({ x: state.point.x + v.x, y: state.point.y + v.y }), colors.direction);
        }

        drawPoint(current);
    }
};
