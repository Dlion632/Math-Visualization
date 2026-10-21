# Project Instructions

- Use plain HTML, CSS, and JavaScript only.

- Do not use frameworks, libraries, bundlers, or build tools unless explicitly requested.

- Make the smallest correct change that satisfies the current prompt.

- Implement only what is explicitly requested.

- Do not add extra features, UI, styling, validation, tests, or abstractions unless requested.

- Preserve the existing structure and style of the code.

- Do not refactor, rename, reorganize, or introduce architecture unless explicitly requested.

- Prefer simple, direct, local code over reusable/general solutions.

# Architecture

The code follows the chain:
mathematical idea → tiny calculation → world coordinates → rendered movement.

```
js/
  main.js                 starts everything, switches projects, redraws
  core/                   the coordinate system itself, knows nothing about any project
    view.js               world ↔ screen conversion, pan/zoom numbers, canvas size (draws nothing)
    grid.js               draws the grid, axes and numbers
    pens.js               drawing tools that take world coordinates
    input.js              pan, zoom, and dragging things a project lets you grab
  projects/               things drawn on the coordinate system
    coordinates.js        draggable point
    tiny-steps.js         Sine — Tiny Steps: state, buttons, drawing
    tiny-steps-math.js    the tiny-step rule: plain numbers only
```

Rules:

- `core/` never imports from `projects/`. Projects use `core/`, not the other way round.
- Projects draw only with the pens in `pens.js`, using world coordinates. Pixels belong to `core/`.
- Math lives in its own `*-math.js` file: unit-circle numbers, no canvas, no world units, no `Math.sin` or `Math.cos`.
- The page uses ES modules, so it must be opened through a local server (for example `npx serve`), not by double-clicking `index.html`.

A project is an object with:

- `draw()` — required, draws the project
- `setup(redraw)` — optional, wires its controls and keeps `redraw` to call after changes
- `stop()` — optional, stops animations when another project is selected
- `grab(world)` and `drag(world)` — optional, make something draggable

Adding a project:

1. Create its file in `js/projects/` (and a `*-math.js` file if it has math).
2. Add an `<option>` to `#project-select` and a controls `<div>` in `index.html`.
3. Register it in the `projects` and `panels` lists in `main.js`.