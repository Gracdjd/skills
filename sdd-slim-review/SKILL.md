---
name: sdd-slim-review
description: |
  Use when: 需要对实现结果做 review，并在产出 findings 后直接修复 actionable findings，再运行最终 verification harness。
  审查顺序：先看 spec 合规，再看 bug/质量/回归风险，然后直接修复 actionable findings，最后运行统一 verification harness 并回写测试报告。
  verification harness 必须根据目标类型选择 lane：web / browser UI 用 `e2e`，其他目标用 `unit`；同时每次需求收尾都要对照 `.sdd-slim/_project/test.md` 执行项目级回归基线。报告中必须包含 unit test coverage 与 e2e success rate，未执行的一侧也要明确写原因。
  如果目标涉及 web / browser UI，review 与 e2e 验证都必须使用 agent-browser 做自动化验证；开始前先加载 agent-browser skill，并按其要求执行 `agent-browser skills get agent-browser`。
  review 阶段必须是 subagent 驱动：默认串行；如果用户主动要求并行，主 agent 必须自行做独立性判断，能并行就直接开启，不能并行就自动降级串行并记录原因；final harness 报告仍由主 agent 串行收口。标准 review 阶段禁止打断用户：遇到目标范围不清、多候选 artifact set、修复标准含糊或并行争议时，必须基于 spec、diff、harness 与当前代码做最保守判断，记录 assumption / deferred / blocker，并直接运行到阶段终态。详细 findings、repair notes 与 harness report 回写到 `worklog.md`，`spec.md` 只保留高层状态与必要 follow-up。
user-invocable: true
---

# SDD Slim Review

先做 review，再直接 repair actionable findings。

## 路由

1. 读取 `review.md`
2. 读取 `harness.md`
3. review subagent 下发参考 `prompts/subagent-review-prompt.md`
4. repair subagent 下发参考 `prompts/subagent-repair-prompt.md`
5. final harness subagent 下发参考 `prompts/subagent-verification-harness-prompt.md`
6. 使用 `templates/review-findings.md` 记录审查结论与验证报告
7. 输出问题时参考 `prompts/finding-output.md`
8. 示例见 `examples/review-findings-example.md`

## 独立性规则

- 本 skill 只能由用户手动调用
- review、repair 与 final verification harness 都必须由 subagent 驱动；主 agent 只负责切分包边界、审核结果、回写 `worklog.md`、同步 `spec.md` 状态、决定完成状态
- 默认串行：review 包与 repair 包都必须逐个顺序处理
- 如果用户消息中带有 `--mutiAgent`，或明确表达要并行开启多个 agent / 多个 subagent，主 agent 必须自行判断是否可安全并行；可并行就直接进入 multiAgent，不可并行就退回串行并记录原因
- multiAgent 模式只允许并行处理彼此独立的 review 包或 repair 包；`worklog.md` 写回、最终 findings 裁定、Fix status 更新与 harness report 聚合仍必须由主 agent 串行收口
- 如果目标涉及 web / browser UI，必须使用 agent-browser 做至少一轮自动化验证；如果当前环境无法使用 agent-browser，必须记录 blocker 或验证缺口，不能宣称 web review 或 e2e harness 完整
- final harness 必须输出 unit coverage 与 e2e success rate；未执行的一侧必须标明 `skipped` / `blocked` 与原因
- final harness 必须显式报告 `.sdd-slim/_project/test.md` 中项目级回归基线的执行结果
- 标准 review 阶段禁止用 `askquestion` 打断用户；范围不清、修复标准含糊或目标有多解时，必须自主做最保守判断并记录 assumption / deferred / blocker
- 不自动进入任何其他 skill
- review 完成后必须同步完成本轮 actionable findings 的直接修复，并在收尾前执行 final verification harness；若 required harness 无法完成，必须明确记录 blocker / deferred 原因，然后停止
