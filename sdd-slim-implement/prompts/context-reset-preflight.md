# Context Compression Preflight Template

Use this before `sdd-slim-implement` starts reading the spec.

```text
Preflight:

1. Check whether the current environment actually exposes a callable `compact` / `compress` capability.
2. If it exists, call it exactly once before implementation begins.
3. Explicitly note that compaction only reduces context; it is not a true clear and not a fresh session.
4. If compaction does not exist, do not invent it and do not switch to `clear` / reset / new session as a substitute; simply note that no context compression was performed.
5. After preflight, re-read the selected spec and rely only on that spec plus current code.
```

Rule:

- implement 的默认 preflight 是上下文压缩，不是 fresh-context reset
- 不要假设所有 agent 环境都有 `compact` / `compress`；没有就明确说明未压缩并继续
- 不要把 `clear` / reset / new session 当作 implement preflight 的自动替代路径
