# SDD Slim Review — Review, Repair, And Verification Harness

> 输入：实现后的代码 + 相关 feature artifact set
> 输出：review findings + 对 actionable findings 的直接修复结果 + verification harness report

## 多文档回写策略（CRITICAL）

- 详细 review 结论写入当前 feature folder 的 `worklog.md`：`Review Findings`、`Repair Notes`、`Verification Harness Report`
- `spec.md` 只同步高层状态与必要 follow-up，不再承载完整 findings 明细
- 默认不创建单独的 review report
- 只有当用户明确要求额外报告时，才额外输出独立文件

## HARD GATES

- 只能由用户显式触发 `sdd-slim-review`
- review 顺序必须是：spec 合规 → bug / 质量 / 回归风险 → 直接修复 actionable findings → final verification harness
- review、repair 与 final verification harness 都必须由 subagent 驱动；主 agent 不得直接承担产品代码修复，也不得跳过 final harness 直接收尾
- 必须读取并遵循 `harness.md`
- 如果目标涉及 web / browser UI，required harness 必须是 `e2e`，并且必须使用 agent-browser 做自动化验证；开始前先加载 agent-browser skill，并按其要求执行 `agent-browser skills get agent-browser`
- 如果目标不涉及 web / browser UI，required harness 必须是 `unit`，并尽量用 coverage-enabled 的项目原生 unit test command 做 deterministic 验证
- 每次需求收尾都必须对照 `.sdd-slim/_project/test.md` 执行项目级回归基线，除非明确 `blocked` 或 `skipped`
- 如果目标 spec / review 范围不明确，不得用 `askquestion` 打断用户；主 agent 必须基于当前请求、diff、artifact set 与 harness 约束自动选择最相关范围，并在 `worklog.md` 中记录依据
- 不得自动进入任何其他 skill
- 每条 actionable finding 必须有稳定的 `R*` 编号，并在同一阶段内被修复、deferred 或阻塞说明收口
- final harness 必须生成统一测试报告，其中 unit coverage 与 e2e success rate 两个字段都必须出现；未执行的一侧也必须明确给出 `skipped` / `blocked` 原因
- 默认串行；如果用户明确要求并行 review / repair，主 agent 必须直接做独立性判断；可安全并行则开启 multiAgent，不可安全并行则退回串行并记录原因

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

- agent-browser skill
- 关键用户路径列表
- 需要复现或验证的交互行为

无论目标类型如何，都额外读取：

- `harness.md`
- `spec.md` 中已有的 `Verification Strategy`

### 3. 切分 subagent 包

- review 包：默认按 `P*`、文件簇、或明确的风险域逐个切分
- repair 包：默认按 `R*` 逐个切分
- harness 包：默认收敛为一个 final verification harness 包，由主 agent 串行汇总结果
- 默认串行；如果检测到 `--mutiAgent` 或用户明确要求并行，主 agent 必须直接判断是否开启并行
- 只有确认彼此独立时，才允许对 review 包或 `R*` repair 包并行派发 subagent；否则自动退回串行，并把原因写入 `Repair Notes` 或 `Review Findings`

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

- 必须优先使用 agent-browser 做自动化探索、复现与验证
- 开始前先加载 agent-browser skill，并按其要求执行 `agent-browser skills get agent-browser`
- 优先覆盖关键路径、当前改动影响路径以及与 findings 直接相关的交互
- 如果仓库已有 Playwright / Cypress 等 E2E suite，优先把它作为可重复的 harness 执行入口；agent-browser 仍要用于关键路径复现、补洞验证或 artifact 捕获
- 如果当前环境无法使用 agent-browser，必须把该限制写入 `worklog.md` 的 `Review Findings` 范围或 blocker，不能把 web 路径宣称为已充分审查，也不能把 e2e harness 宣称为已完整执行

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

`Fix status` 只允许：

- `open`
- `fixed`
- `deferred`

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
- Actionable findings（供同阶段 immediate repair 消费）
- 已运行的验证
- agent-browser 自动化验证（如适用）
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

## 非打断规则

- 标准 review 阶段禁止通过 `askquestion` 向用户要额外决策
- 目标范围不清时，自动选择最相关的 feature folder，并记录选择依据
- finding 成功标准不够清楚时，按 `spec.md`、`Acceptance Criteria`、`Verification Strategy` 与实际代码行为取最保守解释
- 无法安全修复的 finding 标记为 `deferred` 或 `blocked`，但本轮 review 仍必须继续完成其余 review、repair 与 final harness 收口
- agent-browser、project regression 或 required harness 无法执行时，不等待用户回复；直接把对应 lane 标成 `blocked` 或 `skipped`，给出 grounded 原因，并以最终 verdict 收口
