# Parallel Execution Demo

This demo helps students see how Codex-style work can run faster when independent workstreams are launched in parallel instead of one after another.

The app is intentionally small:

- The backend simulates Codex agents with deterministic durations.
- The frontend lets students run the same scenario in sequential or parallel mode.
- The returned timeline makes it easy to analyze what started, what finished, and why total time changes.

## Folder Structure

```text
Parallel-execution/
  backend/
    src/
      index.js
      scenarios.js
  frontend/
    src/
      App.jsx
      index.css
      main.jsx
```

## Run The Backend

```bash
cd "Module-5-and-6/Parallel-execution/backend"
npm install
npm start
```

The backend runs on `http://localhost:4100`.

Useful endpoints:

- `GET /api/scenarios`
- `POST /api/run`

Example request body:

```json
{
  "scenarioId": "feature-build",
  "mode": "parallel"
}
```

## Run The Frontend

Open a second terminal:

```bash
cd "Module-5-and-6/Parallel-execution/frontend"
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

If the backend is running somewhere else, start the frontend with:

```bash
$env:VITE_API_BASE="http://localhost:4100"; npm run dev
```

## Classroom Flow

1. Start the backend and frontend.
2. Pick the `Build a feature with multiple Codex workstreams` scenario.
3. Run it in sequential mode and note the total time.
4. Run it in parallel mode and compare the total time.
5. Inspect `backend/src/index.js` and find where `Promise.all` is used.
6. Inspect `backend/src/scenarios.js` and change one duration.
7. Run both modes again and explain how the timeline changed.

## Files To Inspect First

- `backend/src/scenarios.js`: Defines the simulated Codex workstreams.
- `backend/src/index.js`: Shows the sequential and parallel orchestration.
- `frontend/src/App.jsx`: Renders controls, comparison numbers, and timeline bars.

## Observation Prompts

- Which workstreams can safely happen in parallel?
- Which workstream would become a blocker if its duration doubled?
- Why does sequential mode add every duration together?
- Why does parallel mode finish near the longest single workstream?
- What kinds of real Codex tasks should not be parallelized?

## Teaching Note

This demo does not call Codex or any external AI API. It simulates the orchestration pattern so students can focus on the execution model: independent workstreams, shared scenario data, timing, and result analysis.
