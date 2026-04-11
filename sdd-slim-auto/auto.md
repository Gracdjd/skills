# SDD Slim Auto — End-to-End Orchestration

> 输入：需求文档链接 / 需求正文 / bug 描述 / 重构诉求 / 已存在的 `.sdd-slim/*.spec.md`
> 输出：以下二者之一
> 1. 当前阶段的第一个阻塞问题
> 2. 已完成的 `plan => implement => review => fix` 结果

## 目标

把原本需要用户手动串行输入的四个 skill，合并成一个用户入口。

自动化只改变“下一阶段由谁触发”，不改变四个原 skill 各自的阶段规则。

## 不变性要求（CRITICAL）

- 不修改 `sdd-slim-plan` / `sdd-slim-implement` / `sdd-slim-review` / `sdd-slim-fix` 的任何定义、模板、提问方式或停止条件
- 不通过弱化 gate 来实现自动化；只改变下一阶段的触发方式
- `sdd-slim-plan` 阶段的 `Q*` 提问、`P*` 确认、顺序 subagent 探索、`needs-user-input` 停止等待，必须完整保留
- `sdd-slim-implement` 阶段的 context-reset preflight、只实现已确认 `T*`、阻塞时停止，必须完整保留
- `sdd-slim-plan` 若缺失任一 `P*` 的 subagent 研究或用户确认，禁止自动进入 implement
- `sdd-slim-plan` 若任何代码库 exploration 不是由 subagent 完成，也禁止自动进入 implement
- `sdd-slim-implement` 若未按规则持续回写 spec、或发现实现偏离 spec 但未先记录 deviation/blocker，禁止自动进入 review
- `sdd-slim-review` 阶段只做 review，不修改产品代码
- `sdd-slim-fix` 阶段只修 review 暴露的 actionable findings，不做广泛 review
- 自动化的含义是：当当前阶段已经合法完成且没有用户阻塞时，直接进入下一阶段；不是跳过规则

## 显式授权规则（CRITICAL）

用户显式调用 `sdd-slim-auto`，就等价于一次性授权以下顺序：

`plan -> implement -> review -> fix`

含义：

- 不再要求用户额外手动输入 `sdd-slim-implement`
- 不再要求用户额外手动输入 `sdd-slim-review`
- 不再要求用户额外手动输入 `sdd-slim-fix`

但这不取消任何阶段内的澄清权利：

- 只要某阶段按原规则需要 `askquestion`，就照常提问并停止等待用户
- 用户回答后，继续同一个 `sdd-slim-auto` 流程，而不是要求重新手动指定下一个 skill

## 阶段选择与恢复

每次进入或恢复 `sdd-slim-auto` 时：

1. 定位相关 `.sdd-slim/*.spec.md`
2. 读取选定 spec，结合状态和内容，恢复到最早的未完成阶段
3. 按以下优先级判断下一阶段：
   - 没有 spec，或 spec 仍在 `planning | needs-user-input`，或还没有形成可执行 `Task Checklist`：继续 `plan`
   - spec 已 `ready`，或 `Task Checklist` 仍有未完成项，或实现阶段因 blocker 中断：继续 `implement`
   - 所有 `T*` 已完成，但 `Review Findings` 还未产出最终结论：继续 `review`
   - 存在 `Severity: error | warning` 且 `Fix status: open` 的 findings：继续 `fix`
   - 没有 open actionable findings：流程结束
4. 如果存在多个候选 spec 且无法安全判断，按对应阶段原规则使用 `askquestion`

恢复原则：

- 总是从最早的未完成阶段恢复，不跳阶段
- 总是重新读取当前 spec 与当前代码，不依赖之前对话记忆作为唯一事实来源
- 如果当前轮只是回答了上一轮的 `Q*` / `P*` / `blocking question`，先回写 spec，再继续后续阶段

## 阶段 1：Plan

执行方式：严格遵循 `../sdd-slim-plan/specify.md`。

额外编排要求：

- 仍然由当前用户输入直接启动 planning，不得先让用户重新选择输入类型
- 仍然必须按原规则生成 requirement archive 与 canonical spec
- 仍然必须对每个 `Q*` 和每个 `P*` 用 `askquestion`
- 只要 plan 结果是 `needs-user-input`，必须立即发出当前应问的第一个问题，然后停止等待用户
- 当 plan 结果达到 `ready` 时，不得再问“是否进入 implement”；直接进入阶段 2

## 阶段 2：Implement

执行方式：严格遵循 `../sdd-slim-implement/implement.md`。

额外编排要求：

- 把用户对 `sdd-slim-auto` 的显式触发，视为对 implement 阶段的显式授权
- 在进入实现前，仍必须执行 context-reset preflight
- 如果当前环境没有真实的 `clear` / reset / new session / compact 能力，不得伪造；明确采用 fresh-context fallback，并重新读取 spec 与当前代码
- 只实现已确认的 `T*`
- 如果 implement 因歧义、缺少输入或越界风险而阻塞，按原规则 `askquestion` 或写 blocker note，然后停止等待用户
- 当 implement 达到 `implemented` 或 `implemented-with-issues` 时，不询问是否继续 review；直接进入阶段 3

## 阶段 3：Review

执行方式：严格遵循 `../sdd-slim-review/review.md`。

额外编排要求：

- 把用户对 `sdd-slim-auto` 的显式触发，视为对 review 阶段的显式授权
- 仍然先做 spec 合规审查，再做 bug / 质量 / 回归风险审查
- 仍然只写 findings，不修改产品代码
- 如果 review 没有 actionable findings，直接以 clean 结果收尾，不进入 fix
- 如果 review 存在 `Severity: error | warning` 且 `Fix status: open` 的 findings，直接进入阶段 4

## 阶段 4：Fix

执行方式：严格遵循 `../sdd-slim-fix/fix.md`。

额外编排要求：

- 把用户对 `sdd-slim-auto` 的显式触发，视为对 fix 阶段的显式授权
- 默认消化当前 review 暴露出的全部 actionable findings
- 仍然逐条定位根因、逐条最小修复、逐条验证
- 如果某个 finding 的目标行为或成功标准不清楚，按原规则只问当前 finding，然后停止等待用户
- 修复完成后停止；不要自动再开启第二轮完整 review

## 收尾规则

### A. 因用户输入阻塞而暂停时

只输出当前最关键的信息：

- 当前阶段
- requirement archive 路径（如已存在）
- spec 路径（如已存在）
- 当前状态
- 刚发出的阻塞问题

然后停止，等待用户回答。

### B. 自动链路完整跑完时

至少输出：

- requirement archive 路径
- spec 路径
- 最终状态
- changed files
- validations run
- review findings 数量
- fixed / deferred findings
- residual risks（如果有）

## 明确禁止

- 不得修改原有四个 skill 的文件来“实现自动化”
- 不得在 plan ready 后要求用户手动再输入 `sdd-slim-implement`
- 不得在 implement 完成后要求用户手动再输入 `sdd-slim-review`
- 不得在 review 找到 actionable findings 后要求用户手动再输入 `sdd-slim-fix`
- 不得为了省步骤而跳过 plan 阶段的提问或 implement 阶段的 preflight
- 不得在 fix 完成后自动扩展成一次新的广泛 review
