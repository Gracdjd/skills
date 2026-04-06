---
name: sdd-slim-implement
description: |
  Use when: 已有用户确认过的 canonical `*.spec.md`，现在要严格按文档实现。
  进入实现前先做 context-reset preflight：若环境提供 `clear` / reset 工具则调用一次；若没有，则把本阶段视为 fresh context。
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
- 开始实现前，若环境支持 `clear` / reset 工具，应先执行一次 context reset
- 如果当前环境没有 `clear` 工具，不得假设其存在；改为把本阶段视为 fresh context
- 如有必要，可以用 `askquestion` 做阻塞澄清
- 不自动触发 `sdd-slim-review`
- 不自动触发 `sdd-slim-fix`
- 不自动进入任何其他 skill
- 完成后不主动推荐进入其他 skill
