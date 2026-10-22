"use strict";

// project-template.js — copy this file to start a new project.
// The page ignores it until you register the copy in main.js.
//
// Every project has the same eight parts, always in this order.
// main.js and input.js call them; the project never calls them itself.
//
//   panel         the id of this project's controls <div> in index.html
//   setup()       once, when the page loads: connect buttons and inputs
//   enter()       this project was chosen in the menu
//   update(dt)    every frame: CHANGE the state (dt = seconds since last frame)
//   draw()        every frame, right after update(): SHOW the state
//   leave()       another project was chosen: pause what is running
//   grab(world)   the mouse was pressed at this world point:
//                 return true to take the drag, false to let the view pan
//   drag(world)   the mouse moved while this project holds the drag
//
// Keep every part, even when it is empty.
//
// Rules:
//   - Buttons and update() change the state. draw() only shows it.
//   - draw() uses the pens from core/pens.js with world coordinates.
//   - Math goes in a separate name-math.js file: numbers only.

import { drawPoint } from "../core/pens.js";

// ── 1. State ──────────────────────────────────────────────────
// Everything the project remembers between frames.

const state = {
    point: { x: 0, y: 0 }   // world coordinates
};

// ── 2. Helpers ────────────────────────────────────────────────
// Small functions used by the lifecycle below.

// ── 3. Lifecycle ──────────────────────────────────────────────

export const templateProject = {
    panel: "template-controls",

    setup() {
    },

    enter() {
    },

    update(dt) {
    },

    draw() {
        drawPoint(state.point);
    },

    leave() {
    },

    grab(world) {
        return false;
    },

    drag(world) {
    }
};
