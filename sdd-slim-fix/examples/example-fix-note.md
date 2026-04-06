# Example Fix Note

```md
- 2026-04-06 FIX
  - Target findings: R1
  - Resolved findings: R1
  - Deferred findings: none
  - Root cause summary: submit handler lacked early return when `isSubmitting` is true
  - Files changed: `src/pages/checkout/index.tsx`
  - Validations run: manual duplicate-click regression + `lsp_diagnostics`
  - Residual risk: none
```
