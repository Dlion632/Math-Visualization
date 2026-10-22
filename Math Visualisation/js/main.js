"use strict";

// main.js — runs the lifecycle.
//
// Every project has the same eight parts (see projects/project-template.js).
// This file decides WHEN each one is called. A project never calls its own
// lifecycle functions, never redraws, and never starts its own timer.
//
//   WHEN                    WHAT IS CALLED
//   page loads              setup()        every project, once
//   a menu choice           leave()        the old project
//                           enter()        the new project
//   every frame (~60 / s)   update(dt)     the current project: change the state
//                           clear → grid → draw() → grid numbers
//   mouse pressed           grab(world)    the current project (from input.js)
//   mouse moved             drag(world)    the current project (from input.js)

import { setupView, resizeView, clearCanvas } from "./core/view.js";
import { drawGrid, drawGridLabels } from "./core/grid.js";
import { setupInput } from "./core/input.js";
import { coordinatesProject } from "./projects/coordinates.js";
import { tinyStepsProject } from "./projects/tiny-steps.js";

// ── The projects ──────────────────────────────────────────────
// Each key must match an <option value="..."> in index.html.
const projects = {
    "coordinates": coordinatesProject,
    "tiny-steps": tinyStepsProject
};

// ── The contract ──────────────────────────────────────────────
// Every project must have all of these, even if some are empty.
const REQUIRED_FUNCTIONS = ["setup", "enter", "update", "draw", "leave", "grab", "drag"];

function checkProject(name, project) {
    const missing = REQUIRED_FUNCTIONS.filter((key) => typeof project[key] !== "function");
    if (typeof project.panel !== "string") missing.unshift("panel");

    if (missing.length > 0) {
        throw new Error(`Project "${name}" is missing: ${missing.join(", ")}. Compare it with js/projects/project-template.js.`);
    }
    if (document.getElementById(project.panel) === null) {
        throw new Error(`Project "${name}" uses panel "${project.panel}", but index.html has no element with that id.`);
    }
}

// ── A menu choice ─────────────────────────────────────────────
let current = null;

function chooseProject(name) {
    if (current !== null) current.leave();
    current = projects[name];

    for (const key in projects) {
        document.getElementById(projects[key].panel).hidden = key !== name;
    }
    const select = document.getElementById("project-select");
    document.getElementById("project-title").textContent = select.options[select.selectedIndex].text;

    current.enter();
}

// ── Every frame ───────────────────────────────────────────────
let lastTime = null;

function frame(time) {
    // seconds since the previous frame; capped, so a hidden tab
    // does not cause one giant jump when you come back
    const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    current.update(dt);

    clearCanvas();
    drawGrid();
    current.draw();
    drawGridLabels();

    requestAnimationFrame(frame);
}

// ── Page loads ────────────────────────────────────────────────
for (const name in projects) checkProject(name, projects[name]);

setupView(document.getElementById("canvas"));
resizeView();
setupInput(() => current);

for (const name in projects) projects[name].setup();

const select = document.getElementById("project-select");
select.addEventListener("change", () => chooseProject(select.value));
chooseProject(select.value);

window.addEventListener("resize", resizeView);

requestAnimationFrame(frame);
