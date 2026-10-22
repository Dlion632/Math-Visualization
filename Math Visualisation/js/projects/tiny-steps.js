"use strict";

// tiny-steps.js — the "Sine — Tiny Steps" project.
//
// Follows the lifecycle in project-template.js, and connects
// the math to the screen in three stages:
//   1. math:   tiny-steps-math.js moves a point in unit-circle coordinates
//   2. world:  toWorld() makes the circle 200 world units big (4 grid cells)
//   3. screen: the pens turn world coordinates into pixels

import { drawCircle, drawLine, drawPath, drawPoint, drawVector } from "../core/pens.js";
import { stepSize, perpendicular, tinyStep, squaredLength } from "./tiny-steps-math.js";

// ── 1. State ──────────────────────────────────────────────────

const UNIT = 200;           // 1 math unit = 200 world units
const RUN_SECONDS = 3;      // Run plays all the steps in about this long

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
    running: false,             // is Run playing?
    clock: 0                    // seconds collected towards the next step
};

// ── 2. Helpers ────────────────────────────────────────────────

function toWorld(p) {
    return { x: p.x * UNIT, y: p.y * UNIT };
}

function input(id) {
    return document.getElementById(id);
}

// Start again at (1, 0): zero radians of travel.
function reset() {
    state.theta = Number(input("theta-input").value) || 0;
    state.steps = Math.max(1, Math.floor(Number(input("steps-input").value) || 1));
    state.h = stepSize(state.theta, state.steps);

    state.step = 0;
    state.point = { x: 1, y: 0 };
    state.path = [state.point];
    state.running = false;
    state.clock = 0;
}

function takeStep() {
    if (state.step >= state.steps) return;
    state.point = tinyStep(state.point, state.h);
    state.path.push(state.point);
    state.step += 1;
}

function showReadout() {
    const p = state.point;
    const len2 = squaredLength(p);

    input("step-value").textContent = `${state.step} / ${state.steps}`;
    input("h-value").textContent = state.h.toFixed(5);
    input("point-value").textContent = `(${p.x.toFixed(5)}, ${p.y.toFixed(5)})`;
    input("length-value").textContent = len2.toFixed(5);
    input("error-value").textContent = (len2 - 1).toFixed(5);
}

// ── 3. Lifecycle ──────────────────────────────────────────────

export const tinyStepsProject = {
    panel: "tiny-step-controls",

    setup() {
        // buttons only change the state; the next frame shows it
        input("theta-input").addEventListener("input", reset);
        input("steps-input").addEventListener("input", reset);
        input("reset-steps").addEventListener("click", reset);
        input("next-step").addEventListener("click", () => {
            state.running = false;
            takeStep();
        });
        input("run-steps").addEventListener("click", () => {
            state.running = true;
        });
        reset();
    },

    enter() {
        // the state is kept from the last visit
    },

    update(dt) {
        if (!state.running) return;

        // collect time, and take one step for every (RUN_SECONDS ÷ steps) seconds
        const secondsPerStep = RUN_SECONDS / state.steps;
        state.clock += dt;
        while (state.clock >= secondsPerStep && state.step < state.steps) {
            takeStep();
            state.clock -= secondsPerStep;
        }
        if (state.step >= state.steps) state.running = false;
    },

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

        showReadout();
    },

    leave() {
        state.running = false;
    },

    grab(world) {
        return false;   // nothing to drag; dragging pans the view
    },

    drag(world) {
    }
};
