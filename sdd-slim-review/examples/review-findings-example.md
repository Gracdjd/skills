# Example Review Findings

```md
## Review Findings

- Scope: `.sdd-slim/2026.04.06.checkout-button-loading-state/spec.md`, checkout submit flow
- Actionable findings: `R1`
- Target classification: `web`
- Required harness: `e2e`
- Validations run: `lsp_diagnostics`, manual duplicate-click regression

### R1 duplicate submit guard missing

- Severity: error
- Summary: loading UI 已接入，但 submit handler 仍允许重复点击触发第二次请求
- Evidence: spec 的 P2/T3 要求禁止重复提交；当前 handler 中没有 `if (isSubmitting) return`
- Affected files: `src/pages/checkout/index.tsx`
- Suggested repair direction: 在 submit handler 顶部增加 guard，并确保异常分支恢复状态
- Suggested validation: 手动快速重复点击，确认不会发起第二次请求
- Fix status: open

## Repair Notes

- repaired findings: none yet
- deferred findings / blockers: `R1`
- files changed: none yet
- validations run: `lsp_diagnostics`, manual duplicate-click regression
- residual risks: 用户仍可重复提交，需在同轮 review 的 immediate repair 中关闭 `R1`

## Verification Harness Report

- Target classification: `web`
- Required harness: `e2e`
- Overall verdict: `pass`
- Commands run: `agent-browser` checkout critical journeys, `pnpm test -- --coverage`, `lsp_diagnostics`

### Unit Tests

- Status: `skipped`
- Result: `n/a`
- Coverage source: `n/a`
- Coverage: lines `n/a` | functions `n/a` | branches `n/a` | statements `n/a`
- Below-threshold files: `n/a`
- Baseline delta: `n/a`

### E2E

- Status: `executed`
- Journeys: `J1 submit enters loading`, `J2 duplicate click blocked`, `J3 failed submit recovers state`
- Result: `3/3`
- Success rate: `100%`
- Artifacts: `agent-browser` screenshots for loading state and failure toast
- Flaky observations: none

### Project Regression

- Status: `executed`
- Baseline suites / journeys: `U1 checkout form unit suite`, `E1 checkout happy path`, `E2 checkout duplicate submit regression`
- Result: `3/3`
- Notes: 本需求影响 checkout submit 主链路，因此重跑了 `.sdd-slim/_project/test.md` 中所有 checkout 基线

- Notes: 单元覆盖率未作为本轮 required lane，因此明确记为 `skipped`；web 目标的 release gate 以 `E2E Success Rate` 为准
```
