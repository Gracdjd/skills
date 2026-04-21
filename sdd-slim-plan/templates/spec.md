# <Feature Title>

> Status: planning | needs-user-input | ready | in-progress | implemented | implemented-with-issues | reviewed | reviewed-clean | fix-needed | fixed | blocked
> Created: YYYY-MM-DD
> Updated: YYYY-MM-DD
> Feature Folder: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/`
> Requirement Archive: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/requirement.md`
> Plan File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/plan.md`
> Worklog File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/worklog.md`
> Project Test File: `.sdd-slim/_project/test.md`
> Requirement Availability: available | partial | missing
> Original Sources: <requirements doc urls / pasted requirement text / local files / metadata-only context>
> Canonical File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/spec.md`
> Dedup Notes: none | <deduped repeated link / repeated pasted block / conflict retained>

## File Role

- This file is the canonical feature contract.
- Keep only confirmed user-facing commitments, acceptance gates, and verification policy here.
- If content mainly explains repo evidence, implementation HOW, or open decision-making, it belongs in `plan.md`.
- If content mainly tracks `T*` progress, implementation evidence, review findings, or harness output, it belongs in `worklog.md`.

## 1. Requirement Summary

- ...

> If `Requirement Availability` is `partial` or `missing`, this section should only summarize known metadata and confirmed facts. Do not invent missing requirement body.
> Keep this as a compressed contract summary, not a `P*` / `Q*` replay.

## 2. Confirmed Scope

### In Scope

- ...

### Out of Scope

- ...

## 3. Acceptance Criteria

- [ ] ...

> Keep only final feature acceptance here. Task decomposition belongs in `worklog.md`.

## 4. Verification Strategy

- Target Surface: web | non-web | mixed
- Required Harness: e2e | unit | hybrid
- Supporting Lanes: unit | e2e | none
- Project Regression:
  - Source File: `.sdd-slim/_project/test.md`
  - Run on Every Feature Close-out: yes
- Unit Harness:
  - Command: <preferred command | none>
  - Coverage Source: <stdout / json / xml / html / none>
  - Minimum Signal: <project baseline or default 80% overall + 80% touched files>
- E2E Harness:
  - Tooling: <playwright-mcp / repo-playwright-suite / cypress / none>
  - Critical Journeys: <J1, J2 ... | none>
  - Minimum Signal: <all critical journeys pass | explicit threshold>
- Report Requirements:
  - Unit Coverage: lines / functions / branches / statements, or explicit n/a reason
  - E2E Success Rate: passed journeys / total journeys, or explicit n/a reason
- Review-Owned Test Generation:
  - Source Section: `plan.md` -> `Test Design Handoff`
  - Expected Output: executable unit / e2e tests as applicable
  - Default E2E Split: Playwright MCP handles agent-side browser execution; repo-native Playwright tests are the preferred durable asset when long-term e2e regression is needed

## 5. Risks / Follow-ups

- ...

> Keep risks here at feature level only. Repo evidence, task packaging risks, and unresolved research details belong in `plan.md`.
