# Context Compression Preflight Template

Use this before `sdd-slim-implement` starts reading the feature artifact set.

```text
Preflight:

1. Detect whether the current environment is OpenCode TUI.
2. If it is OpenCode TUI, execute `/compact` exactly once before implementation begins. `/summarize` is an alias.
3. Otherwise, only call a compaction action if the current environment explicitly documents an equivalent manual compaction entrypoint.
4. If the environment only documents automatic compaction, do not claim that manual compaction was triggered; only note that automatic compaction may occur.
5. Never substitute `clear` / reset / new session for implement preflight.
6. If no manual or automatic compaction capability is known, explicitly note that no context compression was performed.
7. After preflight, re-read the selected `spec.md`、`plan.md`、`worklog.md` and rely only on that artifact set plus current code.
```

Rule:

- implement 的默认 preflight 是上下文压缩，不是 fresh-context reset
- OpenCode 兼容路径应显式使用 `/compact`，而不是抽象写成不可验证的 `compact/compress`
- 如果当前环境只有自动 compaction 配置，没有显式入口，不得把它写成“已手动执行压缩”
- 不要把 `clear` / reset / new session 当作 implement preflight 的自动替代路径
