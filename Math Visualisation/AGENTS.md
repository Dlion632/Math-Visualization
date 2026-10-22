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
  main.js                 runs the lifecycle: the only place that calls the projects and draws
  core/                   the coordinate system itself, knows nothing about any project
    view.js               world ↔ screen conversion, pan/zoom numbers, canvas size (draws nothing)
    grid.js               draws the grid, axes and numbers
    pens.js               drawing tools that take world coordinates
    input.js              pan, zoom, and dragging things a project lets you grab
  projects/               things drawn on the coordinate system
    coordinates.js        draggable point
    tiny-steps.js         Sine — Tiny Steps: state, buttons, drawing
    tiny-steps-math.js    the tiny-step rule: plain numbers only
    project-template.js   the starting point for a new project (not loaded)
```

Rules:

- `core/` never imports from `projects/`. Projects use `core/`, not the other way round.
- Projects draw only with the pens in `pens.js`, using world coordinates. Pixels belong to `core/`.
- Math lives in its own `*-math.js` file: unit-circle numbers, no canvas, no world units, no `Math.sin` or `Math.cos`.
- The page uses ES modules, so it must be opened through a local server (for example `npx serve`), not by double-clicking `index.html`.

## The project lifecycle

Every project has the same eight parts, in the same order, even when some are empty.
`js/projects/project-template.js` is the starting point for a new project.

| Part | Called by | When | Job |
|---|---|---|---|
| `panel` | `main.js` | menu choice | id of the project's controls `<div>` in `index.html` |
| `setup()` | `main.js` | page loads, once | connect buttons and inputs |
| `enter()` | `main.js` | the project is chosen | prepare, if needed |
| `update(dt)` | `main.js` | every frame | change the state (`dt` = seconds since the last frame) |
| `draw()` | `main.js` | every frame, after `update` | show the state with the pens |
| `leave()` | `main.js` | another project is chosen | pause what is running |
| `grab(world)` | `input.js` | mouse pressed | return `true` to take the drag, `false` to pan |
| `drag(world)` | `input.js` | mouse moved while grabbed | move the grabbed thing |

Each frame `main.js` runs: `update(dt)` → clear → grid → `draw()` → grid numbers.

Lifecycle rules:

- Only `main.js` and `input.js` call lifecycle functions. A project never calls its own.
- A project never redraws, and never uses `setInterval`, `setTimeout` or `requestAnimationFrame`. Movement over time goes in `update(dt)`.
- Buttons and `update(dt)` change the state. `draw()` only shows it.
- Each project file has three sections, in this order: `1. State`, `2. Helpers`, `3. Lifecycle`.
- `main.js` checks every project when the page loads and stops with a message naming any missing part.

Adding a project:

1. Copy `js/projects/project-template.js` to `js/projects/name.js` and fill in the parts (add `name-math.js` if it has a rule to compute).
2. In `index.html`, add an `<option value="name">` to `#project-select` and a controls `<div>` whose id matches `panel`.
3. In `main.js`, import it and add one line to the `projects` list.
