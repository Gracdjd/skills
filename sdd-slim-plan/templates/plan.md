# <Feature Title> Plan

> Feature Folder: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/`
> Spec File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/spec.md`
> Requirement Archive: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/requirement.md`
> Worklog File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/worklog.md`

## File Role

- This file is the planning derivation and decision trail.
- Record how the requirement was split, what the repo evidence says, which HOW was proposed, and what still needs confirmation.
- Do not copy `spec.md` in full here; repeat only the minimum contract context needed to explain a planning decision.
- Do not track `T*` execution progress, review output, or final harness results here; that belongs in `worklog.md`.

## 1. Requirement Breakdown

| ID  | Type          | Title | Current Understanding | Source | Status  |
| --- | ------------- | ----- | --------------------- | ------ | ------- |
| P1  | requirement   | ...   | ...                   | ...    | draft   |
| Q1  | clarification | ...   | ...                   | ...    | pending |

> Use this section to decompose the requirement into `P*` / `Q*`, not to restate the whole scope or acceptance text verbatim.

## 2. Clarification Log

### Q1 <title>

- Current understanding:
- Why clarification is needed:
- User answer:
- Final resolution:
- Status: pending | resolved

## 3. Point Confirmation Log

### P1 <title>

- User-facing summary used in askquestion:
- Current understanding presented to user:
- Code basis presented to user:
- Proposed HOW presented to user:
- Candidate tasks presented to user:
- Task packaging / dependency notes presented to user:
- Suggested validation presented to user:
- User answer:
- Final confirmed interpretation:
- Status: pending | confirmed

## 4. Research Findings

### P1 <title>

- Entry files:
- Related modules:
- Reusable patterns:
- Proposed execution approach:
- Candidate tasks:
- Task packaging notes:
- Dependency hints:
- Suggested validations:
- Risks:
- Feasibility:
- Questions requiring user input:

## 5. Pending User Input

- Q1: <what is still missing>

## 6. Coherence Notes

- Reserved for final planning coherence check

## 7. Test Design Handoff

### P1 <title>

- Required lane: <unit | e2e | hybrid>
- Supporting lanes: <unit | e2e | none>
- Unit cases: <U1, U2 ... | none>
- E2E journeys: <J1, J2 ... | none>
- Suggested test files: <path/a.spec.ts, path/b.test.tsx | none>
- Shared fixtures / data setup: <... | none>
- Review-stage generation notes: <what review should materialize into executable tests>

> Translate `spec.md` verification policy into review-ready test design here. Do not duplicate the full `Verification Strategy` block.
