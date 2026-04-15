---
name: sdd-slim-auto
description: |
  Use when: 用户希望从需求文档 / PRD / bug 描述 / 重构诉求直接一路完成
  `sdd-slim-plan => sdd-slim-implement => sdd-slim-review => sdd-slim-fix`。
  该 skill 只是 orchestration layer：不修改原有四个 skill 的定义或独立行为；
  plan 阶段仍按原规则提问，但一旦 plan ready，后续 implement / review / fix
  由当前 skill 自动继续，无需用户再手动输入其他 skill 名称。
  如果任一阶段出现 blocker 或需要用户确认，仍通过 `askquestion` 暂停；
  用户回复后继续同一 auto 流程。
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
   - `../sdd-slim-fix/fix.md`
3. 需要具体模板、提问格式或示例时，继续读取对应 skill 目录下的 `prompts/`、`templates/`、`examples/`

## 核心原则

- `sdd-slim-auto` 是新的用户入口，不修改 `sdd-slim-plan` / `sdd-slim-implement` / `sdd-slim-review` / `sdd-slim-fix`
- 不直接“自动调用”其他四个 skill；而是在当前 skill 内按对应文档顺序执行同等阶段
- 用户显式触发 `sdd-slim-auto`，即表示已授权在当前需求闭环中继续执行 implement / review / fix，无需再单独手动触发其他 skill
- `sdd-slim-plan` 的 `Q*` 提问、`P*` 用户确认、默认串行 subagent 探索，以及在检测到 `--mutiAgent` 或用户明确要求后先经 `askquestion` 确认再切换为 multiAgent 并行探索的规则，必须原样保留
- `sdd-slim-implement` 阶段中新增的 subagent-per-P 执行模型必须原样保留：每个未完成 `P*` 的实现与定向验证都先交给 subagent，主 agent 负责审核、spec 回写、剩余 `P*` 重算与 stop condition
- 任一阶段只要按原规则需要 `askquestion`，就必须提问并停止等待用户回答
- 当前阶段合法完成且无用户阻塞后，才自动进入下一阶段
- 不为了自动化而弱化任何阶段的 hard gate、scope discipline 或 stop condition
