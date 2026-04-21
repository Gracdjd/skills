# <Feature Title> Worklog

> Feature Folder: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/`
> Spec File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/spec.md`
> Plan File: `.sdd-slim/<YYYY.MM.DD>.<feature-name>/plan.md`

## File Role

- This file is the only task and execution ledger for the feature.
- Planning writes implement-ready `T*` packages here.
- Implement and review append execution notes, findings, repairs, and verification output here.
- Do not duplicate `P*` / `Q*` reasoning from `plan.md` or feature-level contract text from `spec.md` unless a task needs a short local reference.

## 1. Task Checklist

- [ ] T1: <task title>
  - Source: P1
  - Files: `path/a`, `path/b`
  - How: ...
  - Acceptance: ...
  - Validation: ...
  - Dependencies: `none`

> Keep each `T*` implement-ready and task-local. This section is not a second copy of feature scope or research findings.

## 2. Execution Notes

- Reserved for `sdd-slim-implement`

## 3. Review Findings

- Reserved for `sdd-slim-review`

## 4. Repair Notes

- Reserved for direct repairs performed inside `sdd-slim-review`

## 5. Verification Harness Report

- Reserved for final verification harness output
