---
name: sdd-slim-review
description: |
  Use when: 需要对实现结果做 review，但只暴露问题，不自动修复。
  审查顺序：先看 spec 合规，再看 bug/质量/回归风险。结果优先回写同一个 spec 文件的 `Review Findings`，并生成带 `R*` 编号的 findings 供后续 fix 使用。
  用户若要修复，必须手动再调用 `sdd-slim-fix`。
user-invocable: true
---

# SDD Slim Review

只做 review，不做 fix。

## 路由

1. 读取 `review.md`
2. review 目标澄清参考 `prompts/review-target-question.md`
3. 使用 `templates/review-findings.md` 记录审查结论
4. 输出问题时参考 `prompts/finding-output.md`
5. 示例见 `examples/review-findings-example.md`

## 独立性规则

- 本 skill 只能由用户手动调用
- 不修改产品代码
- 如有必要，可以用 `askquestion` 澄清 review 目标或范围
- 不自动触发 `sdd-slim-fix`
- 不自动进入任何其他 skill
- review 完成后只暴露 bug / 风险 / 缺口，然后停止
