# Review Findings Template

```md
## Review Findings

- Scope: <feature folder / spec.md / files / diff range>
- Actionable findings: <R1, R2 ... | none>
- Generated tests: <TG1, TG2 ... | none>
- Target classification: <web | non-web | mixed>
- Required harness: <unit | e2e | hybrid>
- Validations run: <...>

### R1 <short title>

- Severity: error | warning | info
- Summary: <what is wrong>
- Evidence: <spec mismatch / diagnostic / code path>
- Affected files: `path/a`, `path/b`
- Suggested repair direction: <what the immediate repair step should target>
- Suggested validation: <how to verify after fixing>
- Fix status: open | fixed | deferred

## Generated Tests

### TG1 <short title>

- Lane: <unit | e2e>
- Source handoff: <P\* / unit cases / journeys>
- Files: <path/a, path/b>
- Immediate validation: <command or browser path>
- Status: generated | updated | blocked
- Notes: <coverage gap closed / residual gap>

## Repair Notes

- repaired findings: <R1, R2 ... | none>
- deferred findings / blockers: <...>
- files changed: <...>
- validations run: <...>
- residual risks: <...>

## Verification Harness Report

- Target classification: <web | non-web | mixed>
- Required harness: <unit | e2e | hybrid>
- Overall verdict: <pass | fail | blocked>
- Commands run: <...>

### Unit Tests

- Status: <executed | skipped | blocked>
- Result: <passed>/<total> | n/a
- Coverage source: <stdout / json / xml / html / none>
- Coverage: lines <...> | functions <...> | branches <...> | statements <...> | n/a
- Below-threshold files: <... | none | n/a>
- Baseline delta: <before -> after | n/a>

### E2E

- Status: <executed | skipped | blocked>
- Journeys: <J1, J2 ... | none>
- Result: <passed>/<total> | n/a
- Success rate: <...%> | n/a
- Artifacts: <screenshots / traces / videos / html report / junit xml / none>
- Flaky observations: <none | details>

### Project Regression

- Status: <executed | skipped | blocked>
- Baseline suites / journeys: <...>
- Result: <passed>/<total> | n/a
- Notes: <why skipped / blocked / scoped>

- Notes: <blockers / residual verification gaps | none>
```
