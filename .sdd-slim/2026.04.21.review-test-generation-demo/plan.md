# Review-Owned Test Generation Demo Plan

> Feature Folder: `.sdd-slim/2026.04.21.review-test-generation-demo/`
> Spec File: `.sdd-slim/2026.04.21.review-test-generation-demo/spec.md`
> Requirement Archive: `.sdd-slim/2026.04.21.review-test-generation-demo/requirement.md`
> Worklog File: `.sdd-slim/2026.04.21.review-test-generation-demo/worklog.md`

## 1. Requirement Breakdown

| ID  | Type          | Title                               | Current Understanding                                                                           | Source                     | Status    |
| --- | ------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------- | --------- |
| P1  | requirement   | Build browser-facing demo           | A real React app should demonstrate that review owns executable tests while plan owns design.   | user request               | confirmed |
| P2  | requirement   | Update workflow docs                | Plan should define verification contract and handoff; review should materialize unit/e2e tests. | user request               | confirmed |
| P3  | requirement   | Add default multiAgent auto variant | A new skill should default to multiple subagents without changing base auto behavior.           | user request               | confirmed |
| Q1  | clarification | Which stage should generate tests?  | Tests should be designed in plan and materialized in review.                                    | user clarification request | resolved  |

## 2. Clarification Log

### Q1 Which stage should generate tests?

- Current understanding: both plan and review could potentially own test generation
- Why clarification is needed: ownership affects templates, prompts, and final harness semantics
- User answer: open question raised by user
- Final resolution: plan owns `Verification Strategy` and `Test Design Handoff`; review owns generation of final executable unit/e2e tests
- Status: resolved

## 3. Point Confirmation Log

### P1 Build browser-facing demo

- User-facing summary used in askquestion: create a real web target to validate the workflow
- Current understanding presented to user: a minimal React app with deterministic unit tests and Playwright e2e tests is sufficient
- Code basis presented to user: Vite React TS scaffold in `workflow-demo-web`
- Proposed HOW presented to user: replace the starter page with a workflow board, then add unit and e2e suites
- Candidate tasks presented to user: scaffold app, add logic helpers, add unit tests, add e2e tests
- Suggested validation presented to user: lint + unit + e2e
- User answer: accepted by continuing with implementation
- Final confirmed interpretation: build the demo and validate it with real test runs
- Status: confirmed

### P2 Update workflow docs

- User-facing summary used in askquestion: encode plan-vs-review ownership for test generation
- Current understanding presented to user: planning should design coverage, review should generate executable tests
- Code basis presented to user: `sdd-slim-plan`, `sdd-slim-review`, and `sdd-slim-auto` docs
- Proposed HOW presented to user: add `Test Design Handoff` to planning and `Generated Tests` to review outputs
- Candidate tasks presented to user: update skill entry docs, stage docs, templates, prompts, and examples
- Suggested validation presented to user: diagnostics + semantic grep
- User answer: accepted by continuing with implementation
- Final confirmed interpretation: landed as documentation and template changes
- Status: confirmed

### P3 Add default multiAgent auto variant

- User-facing summary used in askquestion: create a separate default-multi skill instead of changing the base auto skill
- Current understanding presented to user: the new skill should treat invocation as explicit multiAgent approval
- Code basis presented to user: existing `sdd-slim-auto` skill
- Proposed HOW presented to user: add a sibling skill with its own `SKILL.md` and `auto.md`
- Candidate tasks presented to user: create new variant docs and preserve base skill behavior
- Suggested validation presented to user: diagnostics + repo readback
- User answer: requested explicitly in follow-up
- Final confirmed interpretation: create `sdd-sliim-auto-muti`
- Status: confirmed

## 4. Research Findings

### P1 Build browser-facing demo

- Entry files: `workflow-demo-web/src/App.tsx`, `workflow-demo-web/vite.config.ts`, `workflow-demo-web/playwright.config.ts`
- Related modules: `src/lib/coverageBoard.ts`, `src/__tests__`, `tests/`
- Reusable patterns: Vite React TS scaffold, Vitest + RTL, Playwright browser journeys
- Proposed execution approach: build a review board UI that queues review-owned tests and tracks generated coverage
- Candidate tasks: replace starter UI, add helper module, add unit tests, add e2e tests, wire scripts
- Suggested validations: `npm run lint`, `npm run test:unit`, `npm run test:e2e`
- Candidate unit cases / e2e journeys: U1 helper summaries, U2 add/toggle flow, U3 empty-state search, J1 queue and generate, J2 filter empty state
- Suggested test files: `workflow-demo-web/src/__tests__/coverageBoard.test.ts`, `workflow-demo-web/src/__tests__/App.test.tsx`, `workflow-demo-web/tests/review-board.spec.ts`
- Risks: locator ambiguity between owner/search labels; preview server orchestration for e2e
- Feasibility: high
- Questions requiring user input: none

### P2 Update workflow docs

- Entry files: `sdd-slim-plan/SKILL.md`, `sdd-slim-plan/specify.md`, `sdd-slim-review/SKILL.md`, `sdd-slim-review/review.md`, `sdd-slim-auto/auto.md`
- Related modules: plan/review templates, review prompts, examples
- Reusable patterns: existing verification strategy and review findings templates
- Proposed execution approach: introduce planning-side test handoff and review-side generated tests section
- Candidate tasks: update docs, templates, examples, and prompts
- Suggested validations: markdown diagnostics + grep for new responsibility language
- Candidate unit cases / e2e journeys: none
- Suggested test files: none
- Risks: documentation drift between entry docs and stage docs
- Feasibility: high
- Questions requiring user input: none

### P3 Add default multiAgent auto variant

- Entry files: `sdd-sliim-auto-muti/SKILL.md`, `sdd-sliim-auto-muti/auto.md`
- Related modules: `sdd-slim-auto/auto.md`
- Reusable patterns: existing auto orchestration language and multiAgent downgrade rules
- Proposed execution approach: treat the variant's invocation as explicit multiAgent authorization while preserving all other stage rules
- Candidate tasks: create the new skill docs and define downgrade behavior
- Suggested validations: markdown diagnostics
- Candidate unit cases / e2e journeys: none
- Suggested test files: none
- Risks: users confusing the variant with the base skill
- Feasibility: high
- Questions requiring user input: none

## 5. Pending User Input

- none

## 6. Coherence Notes

- The demo, docs, and new skill all align around the same rule: plan defines the contract, review materializes the tests, and multiAgent stays explicit and auditable.

## 7. Test Design Handoff

### P1 Browser-facing demo validation

- Required lane: hybrid
- Supporting lanes: none
- Unit cases: U1 helper summary math, U2 queue + toggle generated status, U3 empty-state validation feedback
- E2E journeys: J1 queue a review-owned package and mark it generated, J2 filter into the empty state
- Suggested test files: `workflow-demo-web/src/__tests__/coverageBoard.test.ts`, `workflow-demo-web/src/__tests__/App.test.tsx`, `workflow-demo-web/tests/review-board.spec.ts`
- Shared fixtures / data setup: use seeded review cases defined in `src/lib/coverageBoard.ts`
- Review-stage generation notes: keep unit tests deterministic with RTL; use Playwright MCP as the default browser execution path and keep `tests/review-board.spec.ts` as the durable repo regression asset

### P2 Workflow doc split

- Required lane: none
- Supporting lanes: none
- Unit cases: none
- E2E journeys: none
- Suggested test files: none
- Shared fixtures / data setup: none
- Review-stage generation notes: validate via diagnostics and semantic readback rather than code tests

### P3 Default multiAgent auto variant

- Required lane: none
- Supporting lanes: none
- Unit cases: none
- E2E journeys: none
- Suggested test files: none
- Shared fixtures / data setup: none
- Review-stage generation notes: validate by documentation consistency and discoverability
