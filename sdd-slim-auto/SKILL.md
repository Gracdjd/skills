---
name: sdd-slim-auto
description: |
  Use when: 用户希望从需求文档 / PRD / bug 描述 / 重构诉求直接一路完成
  `sdd-slim-plan => sdd-slim-implement => sdd-slim-review`。
  该 skill 只是 orchestration layer：不修改原有三个主阶段 skill 的定义或独立行为；
  plan 阶段仍按原规则提问，但一旦 plan ready，后续 implement / review
  由当前 skill 自动继续，无需用户再手动输入其他 skill 名称。
  review 阶段中的 final verification harness 也属于同一闭环：web / browser UI 用 `e2e`，其他目标用 `unit`，并必须产出包含 unit coverage、e2e success rate 与 project regression 结果的统一测试报告。
  只有 plan 阶段允许通过 `askquestion` 暂停等待用户；标准 implement / review 阶段禁止打断用户，遇到歧义、缺口、多候选目标或并行争议时，必须自主做最保守决策并记录 assumption / deferred / blocker，直接运行到阶段终态。
user-invocable: true
---

# SDD Slim Auto

只做 orchestration，不改原 skill 定义。

## 路由

1. 先读取 `auto.md`
2. 把以下文档视为各阶段 canonical rules：
   - `../sdd-slim-plan/specify.md`
   - `../sdd-slim-implement/implement.md`
   - `../sdd-slim-review/review.md`
3. 需要具体模板、提问格式或示例时，继续读取对应 skill 目录下的 `prompts/`、`templates/`、`examples/`

## 核心原则

- `sdd-slim-auto` 是新的用户入口，不修改 `sdd-slim-plan` / `sdd-slim-implement` / `sdd-slim-review`
- 不直接“自动调用”其他三个主阶段 skill；而是在当前 skill 内按对应文档顺序执行同等阶段
- 用户显式触发 `sdd-slim-auto`，即表示已授权在当前需求闭环中继续执行 implement / review，无需再单独手动触发其他 skill
- `sdd-slim-plan` 的 `Q*` 提问、`P*` 用户确认、默认串行 subagent 探索，以及在检测到 `--mutiAgent` 或用户明确要求后先经 `askquestion` 确认再切换为 multiAgent 并行探索的规则，必须原样保留
- `sdd-slim-implement` 阶段中新增的 subagent-per-P 执行模型必须原样保留：每个未完成 `P*` 的实现与定向验证都先交给 subagent，默认串行；若用户要求并行，由主 agent 直接做独立性判断并自动决定是否开启 multiAgent
- `sdd-slim-review` 阶段必须采用 subagent 驱动：先由 review subagent 产出 findings，再由 repair subagent 直接修复 actionable findings；默认串行，若用户要求并行，由主 agent 直接做独立性判断并自动决定是否开启 multiAgent
- `sdd-slim-review` 阶段中的 final verification harness 必须原样保留：web / browser UI 走 `e2e`，其他目标走 `unit`，并在 `worklog.md` 中回写统一测试报告，同时同步必要的 `spec.md` 高层状态
- 只有 plan 阶段的 `askquestion` 可以暂停 auto 流程；implement / review 阶段不得因提问而暂停
- 当前阶段合法完成且无用户阻塞后，才自动进入下一阶段
- 不为了自动化而弱化任何阶段的 hard gate、scope discipline 或 stop condition
