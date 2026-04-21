# SDD Slim Review — Review, Test Generation, Repair, And Verification Harness

> 输入：实现后的代码 + 相关 feature artifact set
> 输出：review findings + review 阶段生成的 unit / e2e tests + 对 actionable findings 的直接修复结果 + verification harness report

## 多文档回写策略（CRITICAL）

- 详细 review 结论写入当前 feature folder 的 `worklog.md`：`Review Findings`、`Repair Notes`、`Verification Harness Report`
- `spec.md` 只同步高层状态与必要 follow-up，不再承载完整 findings 明细
- 默认不创建单独的 review report
- 只有当用户明确要求额外报告时，才额外输出独立文件

## HARD GATES

- 只能由用户显式触发 `sdd-slim-review`
- review 顺序必须是：spec 合规 → bug / 质量 / 回归风险 → 生成 / 更新 executable tests → 直接修复 actionable findings → final verification harness
- review、test generation、repair 与 final verification harness 都必须由 subagent 驱动；主 agent 不得直接承担产品代码修复，也不得跳过 final harness 直接收尾
- 必须读取并遵循 `harness.md`
- 必须读取 `plan.md` 中的 `Test Design Handoff`；plan 负责定义“测什么”，review 负责把它落成真实测试文件
- 如果目标涉及 web / browser UI，required harness 必须是 `e2e`，并且必须优先使用 Playwright MCP 浏览器工具链做自动化验证：先启用浏览器交互工具组，按需补充表单/文件与页面捕获工具组；不得依赖外部 browser skill stub 作为前置条件
- 如果目标不涉及 web / browser UI，required harness 必须是 `unit`，并尽量用 coverage-enabled 的项目原生 unit test command 做 deterministic 验证
- 如果 `Test Design Handoff` 已声明 supporting lane，review 必须尽量一并生成该 lane 的测试文件；只有在明确 blocker 下才允许留空
- 每次需求收尾都必须对照 `.sdd-slim/_project/test.md` 执行项目级回归基线，除非明确 `blocked` 或 `skipped`
- 如果目标 spec / review 范围不明确，不得用 `askquestion` 打断用户；主 agent 必须基于当前请求、diff、artifact set 与 harness 约束自动选择最相关范围，并在 `worklog.md` 中记录依据
- 不得自动进入任何其他 skill
- 每条 actionable finding 必须有稳定的 `R*` 编号，并在同一阶段内被修复、deferred 或阻塞说明收口
- final harness 必须生成统一测试报告，其中 unit coverage 与 e2e success rate 两个字段都必须出现；未执行的一侧也必须明确给出 `skipped` / `blocked` 原因
- 默认串行；如果用户明确要求并行 review / repair，主 agent 必须直接做独立性判断；可安全并行则开启 multiAgent，不可安全并行则退回串行并记录原因
- 只要仍存在未处理完成、未被 blocker 阻断的 review 包、`TG*` 包、`R*` 包或 harness 回流问题，review 就必须继续；不得用“当前先收口一批、下一波再处理”作为合法终态
- 如果输出里出现“下一波建议”“后续建议顺序”“如果你不改方向我下一条继续”之类把剩余 runnable review 工作交回给用户决定的措辞，视为提前收口错误；除非当前轮已经达到 blocker 或最终终态，否则不得停止

## 前置检查

### 1. 选择 review 目标

- 如果存在一个明确相关的 feature folder，优先基于该 folder 的 `spec.md` review
- 如果存在多个候选 `spec.md` 且用户未指定：
  - 主 agent 必须按以下优先级自动选择最相关候选，并把依据写入 `Review Findings` 的 scope 或 notes：与当前用户请求最匹配 > 与当前 changed files / diff 最相关 > 最近仍在推进中的 feature folder
- 如果没有 spec，也可以做临时 review，但必须明确说明“本次 review 无 spec 约束，只按当前代码与用户要求检查”

### 2. 读取最小必要上下文

优先读取：

- 用户要求
- `spec.md`
- `plan.md`
- `worklog.md`
- `.sdd-slim/_project/test.md`
- changed files / diff
- `lsp_diagnostics`
- failing tests / build output

如果目标涉及 web / browser UI，额外准备：

- Playwright MCP 浏览器工具链（浏览器交互；必要时再加表单/文件、页面捕获）
- 关键用户路径列表
- 需要复现或验证的交互行为

无论目标类型如何，都额外读取：

- `harness.md`
- `spec.md` 中已有的 `Verification Strategy`
- `plan.md` 中已有的 `Test Design Handoff`

### 3. 切分 subagent 包

- review 包：默认按 `P*`、文件簇、或明确的风险域逐个切分
- test generation 包：默认按 `TG*` 逐个切分；每个包只落一个明确的 unit suite 或 e2e journey cluster
- repair 包：默认按 `R*` 逐个切分
- harness 包：默认收敛为一个 final verification harness 包，由主 agent 串行汇总结果
- 默认串行；如果检测到 `--mutiAgent` 或用户明确要求并行，主 agent 必须直接判断是否开启并行
- 只有确认彼此独立时，才允许对 review 包、`TG*` test generation 包或 `R*` repair 包并行派发 subagent；否则自动退回串行，并把原因写入 `Repair Notes` 或 `Review Findings`
- 进度汇报只能作为中间 commentary，不得替代 stop condition；只要还有 runnable 包，就不得输出“下一波建议顺序”后停止

## 两阶段审查

### 阶段 A：Spec 合规审查（先做）

逐项检查：

- 代码是否覆盖了 `spec.md` 的 in-scope 内容
- 验收标准是否都有对应实现或验证
- 是否有 spec 未要求的过度实现
- `worklog.md` 的 task checklist 中承诺修改的关键文件是否真的被触达

### 阶段 B：代码质量 / bug 审查（后做）

重点检查：

- 明显逻辑错误
- 空值 / 边界条件缺失
- 回归风险
- 诊断 / 测试 / 构建失败
- 明确会造成维护风险的问题

## Web Target Automation（CRITICAL）

如果目标涉及 web / browser UI：

- 必须优先使用 Playwright MCP 做自动化探索、复现与验证
- 开始前先启用浏览器交互工具组；遇到表单填写、文件上传下载时启用表单/文件工具组；需要截图、快照或可访问性证据时启用页面捕获工具组
- 优先覆盖关键路径、当前改动影响路径以及与 findings 直接相关的交互
- 如果仓库已有 Playwright / Cypress 等 E2E suite，review 仍应把仓库内测试文件当作可持续回归资产维护；但 agent 侧的默认执行入口仍是 Playwright MCP，项目命令只作为 CI 或显式回归复跑的次级路径
- 不得把 raw CLI e2e 复跑当成默认或唯一的 agent 侧验证证据
- 如果当前环境无法使用 Playwright MCP，必须把该限制写入 `worklog.md` 的 `Review Findings` 范围或 blocker；只有当 spec 或项目级基线明确允许“项目命令兜底”时，才可退回仓库原生命令，否则不能把 web 路径宣称为已充分审查，也不能把 e2e harness 宣称为已完整执行

## Findings 处理规则

所有发现都要先记录，再决定是否立即进入修复。

严重度：

| 严重度  | 含义                                            | 默认是否进入 immediate repair |
| ------- | ----------------------------------------------- | ----------------------------- |
| error   | 明确 bug / requirement mismatch / failing check | 是                            |
| warning | 有现实风险、值得修复的问题                      | 是                            |
| info    | 建议 / 观察 / 轻微偏差                          | 否                            |

每条 finding 至少包含：

- ID
- Severity
- Summary
- Evidence
- Affected files
- Suggested repair direction
- Suggested validation
- Fix status

如果某个 finding 的本质是“缺少 deterministic unit / e2e coverage”或“现有测试未覆盖验收面”，必须把它保留为 finding，同时在后续 `Generated Tests` 中创建对应 `TG*` 包来落地测试。

`Fix status` 只允许：

- `open`
- `fixed`
- `deferred`

## Test Generation Flow（CRITICAL）

review 阶段必须把 `plan.md` 的 `Test Design Handoff` 落成最终可执行测试；这一步不是建议，而是 review 的正式产物。

规则：

- plan 只定义测试设计，review 负责生成或更新真实测试文件
- 对 `web` 目标，至少要落地 required e2e lane；如果 handoff 中声明了 supporting `unit` lane，review 也必须尽量一并生成
- 对 web 目标，默认优先生成仓库内的 Playwright 测试文件作为长期回归资产；只有仓库已明确采用其他 e2e 框架时才沿用既有框架
- 对 `non-web` 目标，至少要落地 required unit lane；只有在 handoff 中明确声明 browser journey 时才生成 e2e
- 对 `mixed` 目标，review 必须同时检查 unit 与 e2e 的 handoff；未落地的 lane 必须写清 blocker
- 每个待生成的测试包都要编号为 `TG1`、`TG2` ...，并记录其覆盖的 unit cases 或 e2e journeys
- Playwright MCP 负责 agent 侧浏览器执行；生成出的 Playwright 测试文件负责仓库内长期沉淀，这两者不得混为同一种产物
- 生成的测试必须在 final harness 前至少完成一次定向执行；如果当前仓库只新增了持久化的 Playwright 测试文件而未执行项目命令，也必须至少用 Playwright MCP 覆盖对应 journey；如果两者都无法完成，必须记录 blocker

每个 `TG*` 至少记录：

- lane（`unit` / `e2e`）
- 覆盖对象（unit cases / journeys）
- 生成或更新的测试文件
- 立即执行的定向验证
- 仍未覆盖的缺口（如有）

## Repair Flow（CRITICAL）

如果存在 `Severity: error | warning` 且可安全修复的 findings：

- 主 agent 必须把每个 `R*` 作为 repair 包交给 subagent
- 默认按 `R*` 顺序串行修复
- 若进入 multiAgent 模式，也只允许并行处理彼此独立的 `R*`
- 主 agent 在每个 repair subagent 返回后，必须审核改动边界、验证结果、风险与回写内容
- 如果 subagent 返回结果不足以支撑 `R*` 关闭，主 agent 只能重派该 `R*`、记录 blocker，或把 `Fix status` 记为 `deferred`；不得向用户追问后再继续
- 不允许主 agent 直接补写产品代码来替代 repair subagent

## Verification Harness（CRITICAL）

所有 actionable findings 收口后，必须运行 final verification harness。

执行顺序：

1. 根据 `harness.md`、`spec.md` 的 `Verification Strategy` 与 `.sdd-slim/_project/test.md` 判定 `Target classification`
2. 选择 `Required harness`：

- `web` → `e2e`
- `non-web` → `unit`
- `mixed` → 默认仍以 `e2e` 作为 required lane，除非 spec 明确要求 `hybrid`

3. 把 final verification harness 交给 subagent 执行
4. 主 agent 审核：

- required lane 是否真的执行了
- coverage / success rate 是否 grounded
- 项目级回归基线是否真的执行了
- artifacts 与 commands 是否可追溯
- 是否暴露新的 actionable issue

5. 如果 harness 暴露新的 `error` / `warning`：

- 生成新的 `R*` 或重新打开相关 finding
- 回到同一轮 repair
- 不得跳过直接收尾

6. 只有当 required lane 已执行完毕、项目级基线已执行或明确标注 `skipped` / `blocked`，且无未收口的新问题时，才允许写最终 `Verification Harness Report`

报告最低要求：

- `Unit Tests` 始终存在，并报告 coverage 或明确 `skipped` / `blocked`
- `E2E` 始终存在，并报告 success rate 或明确 `skipped` / `blocked`
- `Project Regression` 始终存在，并报告基线 suite / journey 的执行结果，或明确 `skipped` / `blocked`
- web 目标不得缺失 `E2E Success Rate`
- non-web 目标不得缺失 `Unit Coverage`

## 回写规则

把 review 结果写入当前 feature folder 的 `worklog.md`，至少包含：

- Review 范围
- Findings 列表
- Generated Tests 列表
- Actionable findings（供同阶段 immediate repair 消费）
- 已运行的验证
- Playwright MCP 自动化验证（如适用）
- Verification Harness Report
- 仍需用户决定的 blocker（如有）

如果同轮完成了 repair，还必须同步写入 `Repair Notes`，至少包含：

- repaired findings
- deferred findings / blockers
- files changed
- validations run
- residual risks

`spec.md` 只同步状态建议：

- 无 actionable finding → `reviewed-clean`
- 有 `error` / 需要修复的 `warning` → `fix-needed`
- 只有 info 级别 → `reviewed`

## Completion Output

只报告关键结果：

- issues found
- generated tests
- actionable findings
- severities
- validations run
- unit coverage
- e2e success rate
- project regression result
- repaired findings
- deferred findings / blockers
- blockers (if any)

然后停止。

禁止的伪收尾模式：

- 不得在仍有 runnable review / `TG*` / `R*` / harness 回流问题时输出“本轮先做到这里”
- 不得在仍有 runnable 工作包时输出下一批建议顺序并把 baton 交还给用户
- 不得把局部批次总结伪装成 blocker summary 或最终 review 结论

## 非打断规则

- 标准 review 阶段禁止通过 `askquestion` 向用户要额外决策
- 目标范围不清时，自动选择最相关的 feature folder，并记录选择依据
- finding 成功标准不够清楚时，按 `spec.md`、`Acceptance Criteria`、`Verification Strategy` 与实际代码行为取最保守解释
- 无法安全修复的 finding 标记为 `deferred` 或 `blocked`，但本轮 review 仍必须继续完成其余 review、repair 与 final harness 收口
- Playwright MCP、project regression 或 required harness 无法执行时，不等待用户回复；直接把对应 lane 标成 `blocked` 或 `skipped`，给出 grounded 原因，并以最终 verdict 收口
