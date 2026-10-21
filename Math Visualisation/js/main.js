"use strict";

// main.js — starts everything and switches between projects.
//
// Every redraw paints the same four layers, bottom to top:
//   1. clear the canvas
//   2. the coordinate system (grid and axes)
//   3. the current project's drawing
//   4. the grid numbers, so they stay readable on top

import { view, setupView, resizeView, clearCanvas } from "./core/view.js";
import { drawGrid, drawGridLabels } from "./core/grid.js";
import { setupInput } from "./core/input.js";
import { coordinatesProject } from "./projects/coordinates.js";
import { tinyStepsProject } from "./projects/tiny-steps.js";

// The keys match the <option value="..."> in index.html.
const projects = {
    "coordinates": coordinatesProject,
    "tiny-steps": tinyStepsProject
};

// The keys match the id of each project's control panel in index.html.
const panels = {
    "coordinates": "coordinate-controls",
    "tiny-steps": "tiny-step-controls"
};

let current = coordinatesProject;

function redraw() {
    clearCanvas();
    drawGrid();
    current.draw();
    drawGridLabels();
}

function showProject(name) {
    if (current.stop) current.stop();
    current = projects[name];

    for (const key in panels) {
        document.getElementById(panels[key]).hidden = key !== name;
    }

    const select = document.getElementById("project-select");
    document.getElementById("project-title").textContent = select.options[select.selectedIndex].text;

    redraw();
}

setupView(document.getElementById("canvas"));
resizeView();
setupInput(() => current, redraw);

for (const name in projects) {
    if (projects[name].setup) projects[name].setup(redraw);
}

const select = document.getElementById("project-select");
select.addEventListener("change", () => showProject(select.value));
showProject(select.value);

let resizeTimer = null;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resizeView();
        redraw();
    }, 50);
});
