---
name: sdd-slim-implement
description: |
  Use when: 已有用户确认过的 canonical `*.spec.md`，现在要严格按文档实现。
  进入实现前先做 context-reset preflight：优先调用 `clear` / reset；若无，则优先开启 new session / fresh run；若仍无，则再用 compact / compress 作为降级，并明确其不等价于真正 clear。
  然后重新读取 spec → 执行 T* → 更新同一文件的 checklist / execution notes → 验证 → 停止。
  可做必要澄清，但不自动进入 review/fix。
user-invocable: true
---

# SDD Slim Implement

只做 implementation。

## 路由

1. 读取 `implement.md`
2. 实现前预处理参考 `prompts/context-reset-preflight.md`
3. spec 选择提问参考 `prompts/spec-selection-question.md`
4. 阻塞澄清提问参考 `prompts/blocking-question.md`
5. 使用 `templates/execution-note.md` 记录执行结果
6. 如果中途阻塞，使用 `templates/blocker-note.md` 回写 blocker
7. 示例见 `examples/example-execution-notes.md`

## 独立性规则

- 本 skill 只能由用户手动调用
- 开始实现前，按顺序执行 context reset preflight：`clear/reset` → `new session/fresh run` → `compact/compress`
- 如果当前环境没有 `clear` 工具，不得假设其存在
- 如果环境支持新建 session，应优先以新 session 进入 implement
- 如果只能 compact / compress，必须明确说明这只是上下文压缩，不等价于真正 clear
- 如有必要，可以用 `askquestion` 做阻塞澄清
- 实现必须把 spec 当作唯一执行边界：只实现已确认 `T*`，不得因为“顺手修一下”“先跑通主链路”而扩 scope
- 每完成一个 `T*`，都必须立即回写同一 spec 文件中的 `Task Checklist` 与 `Execution Notes`；不得拖到全部代码写完后再统一补记
- 一旦发现实现已经偏离 spec、跳过回写、或在不确定的情况下继续编码，必须立即停止，先回写 deviation/blocker，再决定是否继续
- 如果某项工作尚未写回 spec，就不得宣称该 `T*` 已完成
- 如果验证尚未完成，就不得把该 `T*` 标为 `[x]`
- 不自动触发 `sdd-slim-review`
- 不自动触发 `sdd-slim-fix`
- 不自动进入任何其他 skill
- 完成后不主动推荐进入其他 skill
