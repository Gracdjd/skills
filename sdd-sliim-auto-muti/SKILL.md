---
name: sdd-sliim-auto-muti
description: |
  Use when: 用户希望从需求文档 / PRD / bug 描述 / 重构诉求直接一路完成
  `sdd-slim-plan => sdd-slim-implement => sdd-slim-review`，并且默认开启多个 subagent。
  这是 `sdd-slim-auto` 的 multiAgent 变体：用户显式调用本 skill，就等价于一次性明确授权 plan / implement / review 在可安全并行时优先使用多个 subagent；不需要再额外询问“是否开启多 agent”。
  如果阶段内任务彼此不独立、共享关键文件、顺序强依赖或当前只有单个实现包，主 agent 必须自动降级回串行，并记录原因。
  plan 阶段仍然保留 `Q*` 澄清与 `P*` 用户确认；标准 implement / review 仍然禁止打断用户。implement 阶段默认改为每个 `T*` 一个 subagent，`P*` 只保留为来源点与聚合维度；review 阶段仍需先把 `plan.md` 的 `Test Design Handoff` 落地为真实 unit / e2e 测试文件，再运行 final verification harness。web / browser UI 默认由 Playwright MCP 浏览器工具链执行自动化，仓库内 Playwright 测试文件作为长期回归资产沉淀。
user-invocable: true
---

# SDD Sliim Auto Muti

只做 orchestration，不改原 skill 定义；但把 multiAgent 显式授权前置到 skill 入口。

## 路由

1. 先读取 `auto.md`
2. 把以下文档视为各阶段 canonical rules：
   - `../sdd-slim-plan/specify.md`
   - `../sdd-slim-implement/implement.md`
   - `../sdd-slim-review/review.md`
3. 需要具体模板、提问格式或示例时，继续读取对应 skill 目录下的 `prompts/`、`templates/`、`examples/`

## 核心原则

- 这是 `sdd-slim-auto` 的默认 multiAgent 入口，不覆盖也不改写原 `sdd-slim-auto`
- 用户显式调用 `sdd-sliim-auto-muti`，就等价于一次性明确授权：只要阶段内存在多个彼此独立的工作包，主 agent 应优先开启多个 subagent
- plan 阶段不再额外通过 `askquestion` 询问“是否开启多 agent”；本 skill 的显式触发本身就视为肯定答复
- implement / review 阶段同样把本 skill 触发视为明确的并行意图；主 agent 只负责独立性判断与自动降级
- 任何阶段只要发现并行不安全，就必须退回串行，并把原因写入对应文档；不得为了并行而牺牲边界控制
- 除 multiAgent 默认开启外，其余阶段 hard gates、scope discipline、stop condition、review 测试生成与 final harness 规则都与 `sdd-slim-auto` 保持一致
- 用户若在 auto 流程中途发来状态确认或事实查询，也仍视为同一闭环内的中途 checkpoint：主 agent 必须先回答，再继续；除非用户明确要求只回答或暂停