# SDD Slim Auto — End-to-End Orchestration

> 输入：需求文档链接 / 需求正文 / bug 描述 / 重构诉求 / 已存在的 feature folder 入口 `spec.md`
> 输出：以下三者之一
>
> 1. plan 阶段当前的第一个阻塞问题
> 2. implement / review 阶段的 blocker summary
> 3. 已完成的 `plan => implement => review` 结果

## 目标

把原本需要用户手动串行输入的三个主阶段，合并成一个用户入口。

自动化只改变“下一阶段由谁触发”，不改变三个主阶段各自的阶段规则。

## 不变性要求（CRITICAL）

- 不修改 `sdd-slim-plan` / `sdd-slim-implement` / `sdd-slim-review` 的任何定义、模板、提问方式或停止条件
- 不通过弱化 gate 来实现自动化；只改变下一阶段的触发方式
- `sdd-slim-plan` 阶段的 `Q*` 提问、`P*` 确认、默认串行 subagent 探索，以及在检测到 `--mutiAgent` 或用户明确要求后先经 `askquestion` 确认再切换 multiAgent 并行探索的规则，必须完整保留
- `sdd-slim-implement` 阶段的 context-compression preflight、只实现已确认 `T*`、subagent-per-T 执行模型、主 agent 审核与 `worklog.md` 回写职责、剩余 `T*` 与派生 `P*` 重算与阻塞时停止，必须完整保留；但 implement 阶段不得通过提问暂停用户，所有额外判断都要在本轮内自动收口
- `sdd-slim-review` 阶段的 subagent review + immediate repair、主 agent 审核与 `worklog.md` 回写职责必须完整保留；但 review 阶段不得通过提问暂停用户，所有额外判断都要在本轮内自动收口
- `sdd-slim-review` 阶段在 final harness 前必须先把 `plan.md` 中的 `Test Design Handoff` 落地为真实的 unit / e2e 测试文件；plan 只定义测试设计，不生成最终测试代码
- `sdd-slim-review` 阶段中的 verification harness 规则必须完整保留：web / browser UI 走 `e2e`，其他目标走 `unit`，每次收尾都要执行 `.sdd-slim/_project/test.md` 中的项目级回归基线，报告里必须同时出现 unit coverage 与 e2e success rate 字段
- `sdd-slim-plan` 若缺失任一 `P*` 的 subagent 研究或用户确认，禁止自动进入 implement
- `sdd-slim-plan` 若任何代码库 exploration 不是由 subagent 完成，也禁止自动进入 implement
- `sdd-slim-implement` 若未按规则持续回写 `worklog.md`、或发现实现偏离 spec 但未先记录 deviation / blocker，禁止自动进入 review
- `sdd-slim-implement` 若还有任一未完成 `P*` 未经 subagent 派发并完成合法收口，禁止自动进入 review
- `sdd-slim-implement` 若把当前 `T*` 的完成判定、deviation / blocker 判定或 `spec.md` 状态同步外包给 subagent，也禁止自动进入 review
- `sdd-slim-review` 阶段必须先 review 再直接 repair actionable findings，不得在 findings 产出后停成一个新的独立 fix 阶段
- 自动化的含义是：当当前阶段已经合法完成且没有用户阻塞时，直接进入下一阶段；不是跳过规则
- 任意单次较大验证，例如一次 browser smoke、一次大范围测试通过、一次局部 harness 通过、一次子集 e2e 通过，都只算阶段内 evidence checkpoint；除非已满足 final review + final harness + project regression 的收尾条件，否则不得把它当成整个 auto 流程的完成信号

## 显式授权规则（CRITICAL）

用户显式调用 `sdd-slim-auto`，就等价于一次性授权以下顺序：

`plan -> implement -> review`

含义：

- 不再要求用户额外手动输入 `sdd-slim-implement`
- 不再要求用户额外手动输入 `sdd-slim-review`

但这不取消任何阶段内的澄清权利：

- plan 阶段只要按原规则需要 `askquestion`，就照常提问并停止等待用户
- implement / review 阶段不再通过 `askquestion` 暂停；相关歧义必须在本轮内自动收口
- 用户回答后，继续同一个 `sdd-slim-auto` 流程，而不是要求重新手动指定下一个 skill

## 中途状态问句处理（CRITICAL）

- 如果用户在 auto 流程中途发来的消息，实质上是在询问当前状态、完成度、验证覆盖或剩余工作，例如“现在是否完成”“最终 e2e 是否已经跑过”“还差什么”，主 agent 必须先基于当前 artifacts 与实际验证给出 grounded answer
- 这类状态问句不撤销 auto 授权，也不把当前调用降级成一次纯问答；回答后必须立刻恢复同一个 `sdd-slim-auto` 闭环
- 恢复时仍按“最早未完成阶段优先”重新读取并判定，不得因为刚回答了状态问题就停成一个新的人工接力点
- 只有当用户明确表达“只回答这个问题”“先别继续”“暂停”“stop here”或等价含义时，才允许在回答后停止
- 不得把“当前尚未完成最终 e2e / 还有剩余任务”这类状态回答本身，当作合法 blocker summary 或最终收尾

## 阶段选择与恢复

每次进入或恢复 `sdd-slim-auto` 时：

1. 定位相关 feature folder 的 `spec.md`
2. 读取选定 folder 的 `spec.md`、`plan.md`、`worklog.md`
3. 按以下优先级判断下一阶段：
   - 没有 `spec.md`，或 `spec.md` 仍在 `planning | needs-user-input`，或 `worklog.md` 里还没有形成可执行 `Task Checklist`：继续 `plan`
   - `spec.md` 已 `ready`，或 `Task Checklist` 仍有未完成项，或实现阶段因 blocker 中断：继续 `implement`
   - 所有 `T*` 已完成，且 `worklog.md` 中 `Review Findings` / `Verification Harness Report` 还未产出最终结论，或仍存在尚未被本轮 review 修复完成的 actionable findings：继续 `review`
   - 没有 open actionable findings，且 final harness 已收口：流程结束
4. 如果存在多个候选 `spec.md` 且无法安全判断：

- 在 plan 阶段，按原规则使用 `askquestion`
- 在 implement / review 阶段，自动选择最相关候选并记录依据，不暂停用户

恢复原则：

- 总是从最早的未完成阶段恢复，不跳阶段
- 总是重新读取当前 artifact set 与当前代码，不依赖之前对话记忆作为唯一事实来源
- 如果当前轮只是回答了上一轮的 plan 阶段 `Q*` / `P*`，先回写对应文档，再继续后续阶段
- 如果当前轮只是回答了 auto 流程内的状态问句，回答后仍必须回到同一个恢复逻辑，继续未完成阶段；不得把状态回答当作终态

## 阶段 1：Plan

执行方式：严格遵循 `../sdd-slim-plan/specify.md`。

额外编排要求：

- 仍然由当前用户输入直接启动 planning，不得先让用户重新选择输入类型
- 仍然必须按原规则生成 feature folder 下的 `requirement.md`、`spec.md`、`plan.md`、`worklog.md`，并确保 `.sdd-slim/_project/test.md` 存在
- 仍然必须对每个 `Q*` 和每个 `P*` 用 `askquestion`
- 如果检测到 `--mutiAgent` 或用户明确要求开启多个 subagent，仍然必须先发出单独的确认性 `askquestion`；只有用户明确同意后，plan 阶段才允许并行探索
- 只要 plan 结果是 `needs-user-input`，必须立即发出当前应问的第一个问题，然后停止等待用户
- 当 plan 结果达到 `ready` 时，不得再问“是否进入 implement”；直接进入阶段 2

## 阶段 2：Implement

执行方式：严格遵循 `../sdd-slim-implement/implement.md`。

额外编排要求：

- 把用户对 `sdd-slim-auto` 的显式触发，视为对 implement 阶段的显式授权
- 在进入实现前，仍必须执行 context-compression preflight
- implement preflight 在 OpenCode 中应显式使用 `/compact`；在其他环境中只允许使用已文档化的等价 compaction action；如果当前环境只有自动 compaction 或完全没有该能力，不得伪造手动压缩，也不得改用 `clear` / reset / new session
- 只实现已确认的 `T*`
- 默认沿用 implement 的 subagent-per-T 模型：以单个 `T*` 作为实现包，由主 agent 委派一个 subagent 处理，`P*` 只保留为来源点与聚合维度
- 如果 `Task Checklist` 已声明 `Dependencies`，implement 阶段必须先按依赖拓扑推进；只有依赖已满足且其余边界独立的 `T*` 才能进入并行
- 如果检测到 `--mutiAgent` 或用户明确要求开启多个 agent / subagent 并行实现，implement 阶段必须由主 agent 直接做独立性判断；只有确认独立后才允许并行处理多个 `T*` 实现包，否则自动退回串行
- auto 只负责阶段编排，不改变 implement 内部职责分工：主 agent 仍必须保留审核结果、回写 `worklog.md`、同步 `spec.md` 状态、判定 deviation / blocker、重算剩余 `T*` 与派生 `P*`、决定 `[x] / [~] / blocked` 的职责
- 如果 subagent 返回结果不足以支撑当前 `T*` 的完成判定，必须留在 implement 阶段，由主 agent 重新派发同一 `T*`、收紧边界后再派发，或记录 blocker；不得因为 auto 链路而直接推进到 review，也不得改由主 agent 直接实现该 `T*`
- 如果 implement 因歧义、缺少输入或越界风险而阻塞，必须在本轮内选择最保守实现路径；只有当任何保守路径都不安全时，才写 blocker note 并以 implement 终态收口，不等待用户
- 只有在全部剩余未完成 `T*` 已被处理到终态，且全部 `P*` 已被派生聚合到终态后，implement 才能达到 `implemented` 或 `implemented-with-issues`；此时不询问是否继续 review，直接进入阶段 3
- 只要 implement 阶段仍存在依赖已满足、未被 blocker 阻断的 runnable `T*`，auto 就必须继续推进 implement；不得输出“下一波建议顺序”或“你下一条可以继续这些任务”后提前停止
- implement 阶段即使完成了一次较大验证，也不得询问“要不要继续执行下面的任务”；只要 review 还未完成，当前 auto 链路就不得把该验证当成最终完成

## 阶段 3：Review

执行方式：严格遵循 `../sdd-slim-review/review.md`；该阶段内部先 review，再生成 / 更新 unit / e2e tests，再直接 repair actionable findings，最后运行 final verification harness。

额外编排要求：

- 把用户对 `sdd-slim-auto` 的显式触发，视为对 review 阶段内“审查 + 直接修复”闭环的一次性授权
- 把用户对 `sdd-slim-auto` 的显式触发，也视为对 review 阶段内 final verification harness 的一次性授权
- 如果当前目标涉及 web / browser UI：
  - review、repair 与 e2e harness 都必须优先使用 Playwright MCP 浏览器工具链做自动化验证
  - 开始前先启用浏览器交互工具组；遇到表单/上传再启用表单与文件工具组；需要截图/快照证据时启用页面捕获工具组
  - 不依赖外部 browser skill stub，也不得用纯肉眼检查替代 Playwright MCP
  - required harness 必须是 `e2e`
  - 最终报告中必须给出 `E2E Success Rate`；`Unit Coverage` 若未执行则明确写 `skipped` 原因
  - Playwright MCP 是默认执行入口；仓库原生命令只作为 CI / 显式回归复跑的次级路径
  - 如果当前环境无法使用 Playwright MCP，必须记录 blocker 并停止；只有当 spec 或项目基线明确允许 secondary path 兜底时，才可改为项目原生命令，不得宣称这是默认路径
- 如果当前目标不涉及 web / browser UI：
  - required harness 必须是 `unit`
  - 最终报告中必须给出 `Unit Coverage`
  - `E2E Success Rate` 若未执行则明确写 `skipped` 原因
- review 阶段必须由 subagent 驱动：先由 review subagent 产出 findings，再由 repair subagent 直接修复 actionable findings
- review 阶段必须由 subagent 驱动：先由 review subagent 产出 findings，再由 test generation subagent 基于 `plan.md` 的 `Test Design Handoff` 生成或更新最终测试文件，再由 repair subagent 直接修复 actionable findings
- final verification harness 也必须由 subagent 驱动，主 agent 负责聚合 coverage / success rate、项目级回归基线结果、回写报告与决定最终 verdict
- 默认串行：先顺序完成 review 包，再顺序修复 `R*`
- 如果检测到 `--mutiAgent` 或用户明确要求开启多个 subagent 并行 review / repair，主 agent 必须直接做独立性判断；只有确认独立后才允许并行处理 review 包或 `R*`，否则自动退回串行
- review 子步骤仍然先做 spec 合规审查，再做 bug / 质量 / 回归风险审查
- 如果 review 没有 actionable findings，直接以 clean 结果收尾
- 如果 review 产出 actionable findings，则必须在同一阶段内立即进入 repair 子步骤，无需额外要求用户手动进入 fix
- repair 子步骤默认消化当前 review 暴露出的全部 actionable findings
- repair 子步骤仍然逐条定位根因、逐条最小修复、逐条验证
- actionable findings 收口后，必须运行 final verification harness；若 harness 暴露新的 actionable 问题，必须在同一 review 阶段内继续收口，不能跳过
- final verification harness 必须显式执行或说明 `.sdd-slim/_project/test.md` 中的项目级回归基线
- 如果某个 finding 的目标行为或成功标准不清楚，必须按 `spec.md`、`Acceptance Criteria`、`Verification Strategy` 与当前代码行为做最保守解释；无法安全关闭时标记为 `deferred` 或 `blocked`，但本轮仍继续收口
- 修复完成后停止；不要自动再开启第二轮完整 review
- review 阶段中任何单次较大验证通过，也只算收口过程中的证据；只有 final verification harness、project regression result、coverage / success rate 与最终 report 都已落盘，才允许把整个 auto 流程判为完成

## 收尾规则

### A. 因用户输入阻塞而暂停时

只适用于 plan 阶段。

只输出当前最关键的信息：

- 当前阶段
- requirement archive 路径（如已存在）
- spec 路径（如已存在）
- plan 路径（如已存在）
- worklog 路径（如已存在）
- 当前状态
- 刚发出的阻塞问题

然后停止，等待用户回答。

### B. 因 blocker 收口时

只适用于 implement / review 阶段。

至少输出：

- 当前阶段
- requirement archive 路径（如已存在）
- spec 路径（如已存在）
- plan 路径（如已存在）
- worklog 路径（如已存在）
- 当前状态
- blocker summary
- attempted conservative path
- missing decision / input / dependency（如有）
- 为什么本轮不能安全继续

然后停止；本轮不等待用户当场澄清，也不自动跳阶段。

补充禁止：

- 不得在 implement / review 尚未达到终态时，用“下一波建议”“后续建议顺序”“如果你不改方向我下一条继续”之类的话术把剩余 runnable 工作交回给用户
- 若仍有 runnable 工作包，这类输出视为提前收口错误，不属于 blocker summary
- 不得把对“是否已完成/是否已跑 e2e/还差什么”这类状态问句的回答，当成一次合法停机点；除非用户明确要求只回答或暂停
- 不得因为某次较大验证通过，就询问用户“要不要继续下面任务”“是否继续剩余任务”；这类提问在 auto 模式下属于编排错误

### C. 自动链路完整跑完时

至少输出：

- requirement archive 路径
- spec 路径
- plan 路径
- worklog 路径
- project test 路径
- 最终状态
- changed files
- validations run
- Playwright MCP validations（如适用）
- unit coverage
- e2e success rate
- project regression result
- review findings 数量
- repaired / deferred findings
- residual risks（如果有）

## 明确禁止

- 不得修改原有主阶段 skill 的文件来“实现自动化”
- 不得在 plan ready 后要求用户手动再输入 `sdd-slim-implement`
- 不得在 implement 完成后要求用户手动再输入 `sdd-slim-review`
- 不得在 review 找到 actionable findings 后再切出一个新的独立 fix 阶段
- 不得为了省步骤而跳过 plan 阶段的提问或 implement 阶段的 preflight
- 不得在 review 内的 repair 完成后自动扩展成一次新的广泛 review
- 不得在标准 implement / review 阶段用 `askquestion` 暂停等待用户
- 不得在 implement / review 仍有 runnable 工作包时，用批次总结加下一步建议替代继续执行
- 不得把 auto 流程中的状态问句误判成 standalone QA，从而在回答后放弃继续闭环
- 不得把单次较大验证通过误判成 auto 终态，并在 review 完成前询问用户是否继续剩余任务
