# ToDo App Test Cases (Based on README)

This file converts `README.md` testing prompts into concrete test cases for the React + Node ToDo stack.

## Test Environment
1. Backend: `http://localhost:4000`
2. Frontend: `http://localhost:5173` (or active Vite port)
3. Backend storage is in-memory (restart resets tasks)

## 1. Unit Testing

### TC-UNIT-001 Valid title accepted
- Objective: Validate payload with proper title.
- Input: `{ "title": "Buy groceries" }`
- Expected: `validateTaskPayload(...)` returns `null`

### TC-UNIT-002 Missing title rejected
- Objective: Reject payload without title.
- Input: `{}`
- Expected: returns `"Task title is required."`

### TC-UNIT-003 Whitespace-only title rejected
- Objective: Reject empty logical title.
- Input: `{ "title": "   " }`
- Expected: returns `"Task title is required."`

### TC-UNIT-004 Toggle logic flips completion
- Objective: Verify completion state toggles.
- Setup: task `{ completed: false }`
- Steps:
1. Toggle once
2. Toggle again
- Expected:
1. First result `true`
2. Second result `false`

## 2. Integration Testing

### TC-INT-001 POST then GET task
- Objective: Confirm create persists in in-memory list.
- Steps:
1. `POST /tasks` with valid payload
2. `GET /tasks`
- Expected:
1. POST returns `201`
2. GET contains new task
3. `completed` is `false`

### TC-INT-002 POST then PATCH completion
- Objective: Confirm toggle endpoint updates saved task.
- Steps:
1. Create task using `POST /tasks`
2. Toggle using `PATCH /tasks/:id/complete`
3. Fetch via `GET /tasks`
- Expected:
1. PATCH returns `200`
2. Task appears with `completed: true`

## 3. End-to-End Testing

### TC-E2E-001 Full user flow create + complete
- Objective: Verify UI and backend journey.
- Steps:
1. Open frontend
2. Fill title, due date, notes
3. Submit form
4. Click `Mark complete`
- Expected:
1. Task appears in list
2. Completion state changes visually
3. No API error shown

### TC-E2E-002 UI validation when title is empty
- Objective: Ensure required field behavior.
- Steps:
1. Leave title empty
2. Try submit
- Expected:
1. Submit is blocked by validation

## 4. Front-End Testing

### TC-FE-001 Required title in form
- Objective: Validate required title in React UI.
- Steps:
1. Render app
2. Attempt submit with empty title
- Expected:
1. Form prevents submit

### TC-FE-002 Inputs clear after successful submit
- Objective: Verify state reset after success.
- Steps:
1. Mock successful `POST /tasks`
2. Fill fields and submit
- Expected:
1. Inputs become empty
2. Success status is displayed

### TC-FE-003 Error status shown on API failure
- Objective: Verify error feedback path.
- Steps:
1. Mock failed API response
2. Submit valid form
- Expected:
1. Error status message is displayed

## 5. API Testing

### TC-API-001 GET /tasks contract
- Objective: Validate response type.
- Steps:
1. Call `GET /tasks`
- Expected:
1. `200`
2. JSON array response

### TC-API-002 POST /tasks title requirement
- Objective: Enforce required field.
- Steps:
1. Call `POST /tasks` with missing title
- Expected:
1. `400`
2. Error message for title required

### TC-API-003 PATCH /tasks/:id/complete unknown ID
- Objective: Validate not-found behavior.
- Steps:
1. Call PATCH with non-existing ID
- Expected:
1. `404`
2. Error body present

### TC-API-004 POST /tasks schema check
- Objective: Verify created task shape.
- Steps:
1. `POST /tasks` with valid payload
- Expected fields:
1. `id`
2. `title`
3. `notes`
4. `due`
5. `completed`
6. `createdAt`

## 6. Performance Testing

### TC-PERF-001 k6 ramp test for POST
- Objective: Measure response time under write load.
- Scenario:
1. Ramp to 50 virtual users
2. Send unique `POST /tasks`
- Expected:
1. Stable responses
2. `p95` latency within target threshold

### TC-PERF-002 Artillery burst test for GET
- Objective: Measure read endpoint stability.
- Scenario:
1. Run 200 GET requests
- Expected:
1. No failures
2. Median response time under agreed threshold

## 7. Security Testing

### TC-SEC-001 Script-like payload fuzzing
- Objective: Ensure no crash or unsafe rendering.
- Steps:
1. Submit script-like values in `title` and `notes`
2. Open task in UI
- Expected:
1. API handles request safely
2. UI displays text, no script execution

### TC-SEC-002 Long input fuzzing
- Objective: Check robustness on oversized inputs.
- Steps:
1. Submit very long title/notes
- Expected:
1. Predictable response
2. Server remains stable

## 8. Regression Testing

### TC-REG-001 Create + toggle regression pack
- Objective: Prevent core flow breakage.
- Includes:
1. Unit create validation tests
2. Integration create/toggle tests
3. UI create/toggle tests
- Expected:
1. All pass after each change

### TC-REG-002 Deployment gate run
- Objective: Verify test set in pipeline.
- Steps:
1. Run backend and frontend test commands in CI
- Expected:
1. Build fails on any regression

## 9. Smoke Testing

### TC-SMOKE-001 Backend endpoint sanity
- Objective: Quick health confirmation.
- Steps:
1. `GET /tasks`
2. `POST /tasks`
3. `PATCH /tasks/:id/complete`
- Expected:
1. Endpoints respond with correct status codes

### TC-SMOKE-002 Frontend startup sanity
- Objective: Confirm app loads.
- Steps:
1. Start frontend
2. Open `/`
- Expected:
1. Page loads
2. Form and heading visible

## 10. Acceptance Testing

### TC-ACC-001 Add task from UI and confirm in list
- Objective: Validate business goal for task creation.
- Given: User on ToDo page
- When: User submits valid task
- Then: Saved task appears in list

### TC-ACC-002 Complete and uncomplete task
- Objective: Validate business goal for completion flow.
- Given: Existing task
- When: User toggles completion twice
- Then: State updates correctly each time

## Suggested Execution Order
1. Smoke
2. Unit
3. API
4. Integration
5. Front-end
6. End-to-end
7. Security
8. Performance
9. Regression
10. Acceptance
