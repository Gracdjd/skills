# Review-Owned Test Generation Demo

> Status: reviewed-clean
> Created: 2026-04-21
> Updated: 2026-04-21
> Feature Folder: `.sdd-slim/2026.04.21.review-test-generation-demo/`
> Requirement Archive: `.sdd-slim/2026.04.21.review-test-generation-demo/requirement.md`
> Plan File: `.sdd-slim/2026.04.21.review-test-generation-demo/plan.md`
> Worklog File: `.sdd-slim/2026.04.21.review-test-generation-demo/worklog.md`
> Project Test File: `.sdd-slim/_project/test.md`
> Requirement Availability: available
> Original Sources: session user requests
> Canonical File: `.sdd-slim/2026.04.21.review-test-generation-demo/spec.md`
> Dedup Notes: merged workflow-role clarification and multiAgent follow-up into one implementation set

## 1. Requirement Summary

- Add a real React web demo that proves the workflow on a browser-facing target.
- Move final executable test generation responsibility to review while keeping test design in plan.
- Add a default multi-subagent orchestration entry named `sdd-sliim-auto-muti`.

## 2. Confirmed Scope

### In Scope

- `sdd-slim-plan`, `sdd-slim-review`, and `sdd-slim-auto` documentation updates for the new test-generation split
- new `sdd-sliim-auto-muti` skill
- `workflow-demo-web` React demo app
- demo unit tests and Playwright e2e tests
- project-level regression baseline for the demo

### Out of Scope

- backend services or APIs
- packaging the demo for deployment
- changing the original `sdd-slim-auto` behavior beyond the documented review test-generation rules

## 3. Acceptance Criteria

- [x] planning artifacts define verification strategy and explicit review handoff for unit/e2e test generation
- [x] review artifacts require generation of executable unit/e2e tests before final harness execution
- [x] `sdd-sliim-auto-muti` exists and treats invocation as explicit multiAgent authorization
- [x] the demo web app passes lint, unit tests, and e2e tests

## 4. Verification Strategy

- Target Surface: mixed
- Required Harness: hybrid
- Supporting Lanes: none
- Project Regression:
  - Source File: `.sdd-slim/_project/test.md`
  - Run on Every Feature Close-out: yes
- Unit Harness:
  - Command: `cd workflow-demo-web && npm run test:unit`
  - Coverage Source: stdout + html
  - Minimum Signal: 5/5 tests pass; lines 100%; functions 100%; branches >= 95%; statements 100%
- E2E Harness:
  - Tooling: Playwright MCP primary; repo Playwright suite secondary for CI / explicit rerun
  - Critical Journeys: J1 queue a review-owned package and mark it generated; J2 filter into the empty state
  - Minimum Signal: 2/2 browser journeys pass
- Report Requirements:
  - Unit Coverage: lines / functions / branches / statements
  - E2E Success Rate: passed journeys / total journeys
- Review-Owned Test Generation:
  - Source Section: `plan.md` -> `Test Design Handoff`
  - Expected Output: `workflow-demo-web/src/__tests__/App.test.tsx`, `workflow-demo-web/src/__tests__/coverageBoard.test.ts`, `workflow-demo-web/tests/review-board.spec.ts`

## 5. Risks / Follow-ups

- The new `sdd-sliim-auto-muti` variant must stay clearly documented as a variant, not a silent behavior change to the base auto skill.
