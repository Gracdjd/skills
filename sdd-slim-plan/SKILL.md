---
name: sdd-slim-plan
description: |
  Use when: 用户希望先把需求文档/需求文本整理成单文档 canonical spec。
  该 skill 只生成或更新 `.sdd-slim/<feature>.spec.md`，不写代码，不自动推进到其他 skill。
  对每个任务点的代码库探索与 HOW 生成，必须交给 explorer 子代理完成；每个 `P*` 点都必须至少通过一次 `askquestion` 获得用户澄清 / 确认。
user-invocable: true
---

# SDD Slim Plan

只做 planning / specify。

## 路由

1. 读取 `specify.md`
2. 使用 `templates/spec.md` 作为 canonical spec 模板
3. 对单个 `Q*` 的澄清提问参考 `prompts/clarification-question.md`
4. 对每个 `P*` 的用户确认提问参考 `prompts/point-confirmation-question.md`
5. 对每个 `P*` 使用 `prompts/explorer-task-prompt.md` 驱动 explorer 子代理
6. 输出待补充信息时参考 `prompts/pending-input-output.md`
7. 输出任务研究摘要时参考 `prompts/research-summary-output.md`
8. 示例见 `examples/example.spec.md`

## 独立性规则

- 本 skill 只负责生成 / 更新 spec
- 不写任何产品代码
- 每个 `P*` 都必须至少调用一次 `askquestion`
- 额外的 `Q*` 也必须通过 `askquestion` 一次只问一个问题
- 完成后不主动询问是否进入 `sdd-slim-implement`
- 不触发 `sdd-slim-review`
- 不触发 `sdd-slim-fix`
- 其他 skill 只能由用户手动调用
