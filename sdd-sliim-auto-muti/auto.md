# SDD Sliim Auto Muti — End-to-End Orchestration With Default MultiAgent

> 输入：需求文档链接 / 需求正文 / bug 描述 / 重构诉求 / 已存在的 feature folder 入口 `spec.md`
> 输出：以下三者之一
>
> 1. plan 阶段当前的第一个阻塞问题
> 2. implement / review 阶段的 blocker summary
> 3. 已完成的 `plan => implement => review` 结果

## 目标

把 `sdd-slim-auto` 的闭环编排保留下来，但把“多 subagent 并行”前置为默认入口能力。

该 skill 的显式触发，本身就视为用户对 multiAgent 的明确授权。

## 与 `sdd-slim-auto` 的唯一行为差异（CRITICAL）

- `sdd-slim-auto` 中原本需要单独确认 multiAgent 的地方，在本 skill 中由“用户显式触发 `sdd-sliim-auto-muti`”直接替代
- plan 阶段若存在多个彼此独立的 `P*` 研究包，应默认开启多个 subagent 并行探索；不再额外发出 multiAgent 确认问题
- implement 阶段若存在多个彼此独立的 `T*` 实现包，应默认开启多个 subagent 并行实现；无需等待用户再次表达并行意图
- review 阶段若存在多个彼此独立的 review 包、`TG*` 测试生成包或 `R*` 修复包，应默认开启多个 subagent 并行处理
- 只要任何阶段判断并行不安全，就必须自动降级回串行，并把原因记录到对应文档

## 不变性要求（CRITICAL）

- 除默认 multiAgent 授权外，其余阶段规则与 `../sdd-slim-auto/auto.md` 保持一致
- plan 阶段仍然必须对每个 `Q*` 和每个 `P*` 使用 `askquestion`
- 标准 implement / review 阶段仍然禁止打断用户
- review 阶段仍然必须先把 `plan.md` 的 `Test Design Handoff` 落地为真实 unit / e2e 测试文件，再运行 final verification harness
- web / browser UI 的 agent 侧自动化默认仍由 Playwright MCP 浏览器工具链执行；仓库内 Playwright 测试文件作为长期回归资产，项目命令仅作次级复跑路径
- final report 仍然必须包含 unit coverage、e2e success rate 与 project regression result

## 显式授权规则（CRITICAL）

用户显式调用 `sdd-sliim-auto-muti`，就等价于一次性授权以下两组事实：

1. 阶段顺序授权：

`plan -> implement -> review`

2. multiAgent 授权：

- plan：允许默认并行 subagent 探索
- implement：允许默认并行 subagent 实现
- review：允许默认并行 review / test generation / repair subagent

这不代表强制并行；主 agent 仍必须先做独立性判断。

## 阶段选择与恢复

恢复逻辑与 `sdd-slim-auto` 一致，但在进入各阶段后默认先检查可并行包集合：

- 如果有多个彼此独立的包，优先进入 multiAgent
- 如果只有一个包或存在共享依赖，立即退回串行
- 如果当前轮只是回答了同一需求上的状态问句，例如“是否已完成最终 e2e”“还差什么”，回答后仍必须继续同一个恢复逻辑，而不是停成纯问答

## 阶段 1：Plan

执行方式：严格遵循 `../sdd-slim-plan/specify.md`，但把本 skill 的触发视为已经完成了 multiAgent 肯定确认。

额外编排要求：

- 如果存在多个彼此独立的 `P*` 或研究问题，主 agent 默认直接开启多个 subagent 并行探索
- 不再额外发出“是否确认开启多个 agent 并行完成 plan 阶段探索”的 `askquestion`
- `Q*` 澄清与 `P*` 用户确认仍然逐个串行收口

## 阶段 2：Implement

执行方式：严格遵循 `../sdd-slim-implement/implement.md`。

额外编排要求：

- 把当前 skill 的显式触发，视为 implement 阶段已经获得了并行实现授权
- 如果存在多个彼此独立的 `T*` 实现包，主 agent 默认直接开启 multiAgent
- 如果发现共享关键文件、接口、迁移顺序或验证环境，则自动降级为串行，并在 `Execution Notes` 记录原因
- 即使处于 multiAgent 模式，只要仍有 runnable `T*` 实现包，就必须继续当前 implement 闭环；不得用“下一波并行建议”代替继续执行
- 即使某一轮并行结果已经通过一次较大验证，也只能视为 implement checkpoint；只要 final review 尚未完成，就不得停下来询问是否继续剩余任务

## 阶段 3：Review

执行方式：严格遵循 `../sdd-slim-review/review.md`。

额外编排要求：

- 把当前 skill 的显式触发，视为 review 阶段已经获得了并行 review / `TG*` / `R*` 的授权
- 如果存在多个彼此独立的 review 包、测试生成包或修复包，主 agent 默认直接开启 multiAgent
- 只要发现交叉文件、共享测试环境、共享 selectors 或同一 harness 前置依赖，就必须自动退回串行
- 即使处于 multiAgent 模式，只要仍有 runnable review / `TG*` / `R*` 包，就必须继续当前 review 闭环；不得输出剩余批次建议后提前停止
- 即使并行 review 中某次较大验证已经通过，也不得把它当成终态；只有 final verification harness 与最终报告完成后，才允许结束 auto-muti

## 收尾规则

与 `../sdd-slim-auto/auto.md` 一致。

## 明确禁止

- 不得把“默认开启多个 subagent”理解成“无条件并行”
- 不得为了并行而跳过 plan 的 `Q*` / `P*` 收口
- 不得为了并行而跳过 review 的测试生成或 final harness
- 不得修改原有 `sdd-slim-auto` 文件来实现本变体
- 不得在仍有 runnable 工作包时，用“下一波建议顺序”或“下一条继续这些包”来替代继续执行
- 不得把 auto 流程中的状态问句误判成 standalone QA，从而在回答后停止 multiAgent 闭环
- 不得因为某次较大验证通过，就在 multiAgent 流程里询问用户是否继续剩余任务；在本模式下这属于提前收口错误
