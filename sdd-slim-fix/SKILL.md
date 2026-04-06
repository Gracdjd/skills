---
name: sdd-slim-fix
description: |
  Use when: 需要修复 `sdd-slim-review` 暴露出的所有 actionable findings。
  默认目标是当前 spec 的 `Review Findings` 中所有 `Severity: error|warning` 且 `Fix status: open` 的问题；如果 review 没有暴露任何 actionable findings，再用 `askquestion` 让用户指定要修哪个问题。
  修复时按 finding 列表顺序逐条处理、逐条验证，不做广泛 review，不扩大范围。
user-invocable: true
---

# SDD Slim Fix

只做 targeted fix。

## 路由

1. 读取 `fix.md`
2. 没有 review findings 时，使用 `prompts/fix-target-question.md` 询问用户本轮要修什么
3. 使用 `templates/fix-note.md` 记录修复结果
4. 如果信息不足，使用 `templates/blocker-note.md` 记录 blocker
5. 示例见 `examples/example-fix-note.md`

## 独立性规则

- 本 skill 只能由用户手动调用
- 默认消化当前 review 暴露出的所有 actionable findings
- 如果 review 没有暴露任何 actionable findings，必须用 `askquestion` 让用户指定修复目标
- 如有必要，可以用 `askquestion` 澄清单个 finding 的成功标准或边界
- 不自动触发 `sdd-slim-plan`
- 不自动触发 `sdd-slim-review`
- 不自动进入任何其他 skill
- 完成后不主动推荐进入其他 skill
