"use strict";

// main.js — runs the program.
//
// It looks after two things and keeps them apart:
//
//   1. THE PROJECTS (projects/)        2. THE COORDINATE SYSTEM (core/)
//      startProjects()                    startCoordinateSystem()
//      chooseProject(name)                drawViewportBelow()
//      updateProject(dt)                  drawViewportAbove()
//      drawProject()
//
// 3. Every frame weaves the two together, bottom to top:
//      updateProject(dt) → drawViewportBelow() → drawProject() → drawViewportAbove()
//
// What goes inside a project's parts: see projects/project-template.js.

import { setupView, resizeView, clearCanvas } from "./core/view.js";
import { drawGrid, drawGridLabels } from "./core/grid.js";
import { setupInput } from "./core/input.js";
import { coordinatesProject } from "./projects/coordinates.js";
import { tinyStepsProject } from "./projects/tiny-steps.js";

// ══ 1. The projects ═══════════════════════════════════════════

// Each key must match an <option value="..."> in index.html.
const projects = {
    "coordinates": coordinatesProject,
    "tiny-steps": tinyStepsProject
};

// Every project must have all of these, even if some are empty.
const REQUIRED_FUNCTIONS = ["setup", "enter", "update", "draw", "leave", "grab", "drag"];

let current = null;

function currentProject() {
    return current;
}

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

// Page loads: check every project, set each one up once,
// connect the menu, and show the project the menu starts on.
function startProjects() {
    for (const name in projects) checkProject(name, projects[name]);
    for (const name in projects) projects[name].setup();

    const select = document.getElementById("project-select");
    select.addEventListener("change", () => chooseProject(select.value));
    chooseProject(select.value);
}

// A menu choice: pause the old project, swap the panels, start the new one.
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

function updateProject(dt) {
    current.update(dt);
}

function drawProject() {
    current.draw();
}

// ══ 2. The coordinate system ══════════════════════════════════

// Page loads: size the canvas, connect the mouse, follow window resizes.
function startCoordinateSystem() {
    setupView(document.getElementById("canvas"));
    resizeView();
    setupInput(currentProject);
    window.addEventListener("resize", resizeView);
}

// The viewport under the drawing: an empty canvas with grid lines and axes.
function drawViewportBelow() {
    clearCanvas();
    drawGrid();
}

// The numbers on top, so a drawing never covers them.
function drawViewportAbove() {
    drawGridLabels();
}

// ══ 3. Every frame ════════════════════════════════════════════

let lastTime = null;

function frame(time) {
    // seconds since the previous frame; capped, so a hidden tab
    // does not cause one giant jump when you come back
    const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    updateProject(dt);
    drawViewportBelow();
    drawProject();
    drawViewportAbove();

    requestAnimationFrame(frame);
}

// ══ Start ═════════════════════════════════════════════════════

startProjects();
startCoordinateSystem();
requestAnimationFrame(frame);
