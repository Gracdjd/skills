# SDD Slim Implement — Execute Feature Artifact Set

> 输入：一个已确认的 feature folder，或其入口 `spec.md`
> 输出：实现代码 + 更新后的 `worklog.md` 与 `spec.md`

## 多文档执行模型（CRITICAL）

本阶段维护同一个 feature folder 下的多文档 artifact set：

- `spec.md`：执行边界、状态、验收与 verification strategy
- `plan.md`：研究依据、HOW、风险与用户确认痕迹
- `worklog.md`：唯一的任务进度与执行记录账本

本阶段不单独创建 `tasks.md`。任务进度更新在 `worklog.md` 的 `Task Checklist`，实现记录追加到 `worklog.md` 的 `Execution Notes`。

## Context Compression Preflight（CRITICAL）

进入实现前，先做一次上下文压缩预处理：

- 如果运行环境是 OpenCode TUI，显式执行一次 `/compact`，其别名为 `/summarize`
- 如果不是 OpenCode，只有在当前环境文档明确暴露了等价的显式 compaction action 时，才执行一次对应动作
- 如果当前环境只有自动 compaction 配置或自动压缩行为，必须明确说明“本轮未手动触发压缩，将依赖环境自动 compaction（若发生）”
- 不主动触发 `clear` / reset / session-reset，也不主动开启 new session / fresh run 作为替代
- 如果当前环境既没有显式 compaction action，也没有已知自动 compaction 机制，不要伪造它们；改为显式说明“未进行上下文压缩”后继续
- 无论走哪条路径，后续都必须重新读取 `spec.md`、`plan.md`、`worklog.md`，并只以“选定 artifact set + 当前代码”为事实来源

## HARD GATES

- 只能由用户显式触发 `sdd-slim-implement`
- 编码前必须完整读取选定 feature folder 的 `spec.md`、`plan.md`、`worklog.md`
- 如果存在多个候选 `spec.md` 且用户未指定，主 agent 必须自动选择当前请求最相关的那个，并把选择依据写入 `worklog.md` 的 `Execution Notes`
- 如果 `spec.md` 状态不是 `ready` / `in-progress` / `implemented-with-issues`，直接记录 blocker 并停止
- 只执行已确认的 `T*`；禁止静默扩 scope
- 默认且强制采用 subagent-per-P：每个未完成 `P*` 实现包都必须先交给一个 subagent；一个实现包可覆盖该 `P*` 下多个相关 `T*`，主 agent 负责最终审核与状态裁定
- 主 agent 必须保留以下职责，不能外包：artifact set 事实来源确认、任务顺序推进、`worklog.md` 回写、deviation / blocker 判定、最终完成判定、`spec.md` 状态同步
- subagent 一次只处理一个当前 `P*` 及其关联的 `T*`；若需要跨多个 `P*` 协调，必须拆回主 agent 编排
- 主 agent 不得直接承担当前 `P*` 包的产品代码实现；如果 subagent 结果不足，必须继续重派该 `P*`、缩小该 `P*` 的实现边界后再次派发，或记录 blocker
- 默认模式是串行：按 `P*` 逐个实现；如果检测到 `--mutiAgent` 或用户明确要求开启多个 agent / subagent 并行实现，主 agent 必须直接做独立性判断；只有确认为独立实现包时才开启 multiAgent，否则自动退回串行并记录原因
- multiAgent 模式下，只允许并行处理彼此独立的 `P*` 实现包；不得让多个 agent 同时改动同一个 `P*` 包
- 若多个 `P*` 共享关键文件、公共接口、迁移顺序、测试环境或明显存在合并冲突风险，必须判定为不独立并退回串行模式
- 实现过程中，`worklog.md` 必须持续保持与当前真实进度同步；代码进度不得领先于文档回写超过当前正在执行的一个 `P*` 包增量
- 在当前 `P*` 包执行过程中，每完成一个 `T*` 后，必须先回写 `worklog.md`，再继续该 `P*` 包内剩余任务或进入下一个 `P*`
- implement 的 stop condition 只能是以下两类之一：全部未完成 `P*` 均已被处理到终态，或出现无法安全继续消化的 blocker；不得因为某个 `P*` 已完成就提前结束整个 implement 阶段
- 如果发现当前实现依赖文档未写明的假设、需要新增任务、或需要改动未列入 `T*` 的行为边界，必须先停下：记录 assumption / blocker / deviation，并优先按最保守路径继续；只有在任何保守路径都不安全时才允许结束 implement
- 如果实现过程中已经发生偏离，必须先把已发生的事实补写回 `worklog.md`，必要时同步 `spec.md` 状态，再继续任何开发动作
- 实现中出现新的歧义或缺失信息时，不得用 `askquestion` 打断用户；必须基于 `spec.md`、`plan.md`、`worklog.md` 与当前代码选择最保守解释并记录
- 不得自动进入 `sdd-slim-review`
- 不得自动进入任何其他 skill

## 流程

### 步骤 0：执行 context-compression preflight

1. 识别当前运行环境是否为 OpenCode TUI
2. 如果是 OpenCode TUI：
   - 显式执行一次 `/compact`
   - 说明 `/summarize` 是它的别名
   - 说明这只是上下文压缩，不是 clear，也不是 fresh context
3. 如果不是 OpenCode，再检查当前环境是否文档化地暴露了显式 compaction action：
   - 有则执行一次对应动作，并说明这只是 context compression
4. 如果没有显式 action，但当前环境有已知自动 compaction 机制：
   - 明确说明本轮未手动触发压缩
   - 明确说明将依赖环境自动 compaction（若发生）
5. 如果既没有显式 compaction action，也没有已知自动 compaction 机制：
   - 明确说明当前轮未进行上下文压缩
   - 不伪造 compaction 能力
   - 不改用 `clear/reset` 或 `new session/fresh run`
6. 重新读取 `spec.md`、`plan.md`、`worklog.md`
7. 重新读取当前代码

### 步骤 1：选择目标 artifact set

- 找到 0 个候选 `spec.md`：停止，并说明应先运行 `sdd-slim-plan`
- 找到 1 个：使用它所在的 feature folder
- 找到多个且用户未指定：主 agent 必须按以下优先级自动选择其一，并把依据写入 `worklog.md` 的 `Execution Notes`：与当前用户请求语义最匹配 > 与当前 changed files / diff 最相关 > 最近仍在推进中的 feature folder

### 步骤 2：读取并检查 artifact set

至少确认以下 section 存在且可执行：

- `spec.md`：Confirmed Scope、Acceptance Criteria、Verification Strategy
- `plan.md`：Research Findings、Point Confirmation Log
- `worklog.md`：Task Checklist

如果缺失以上任一关键内容：

- 记录 blocker
- 停止

### 步骤 3：开始实现

1. 把 `spec.md` 状态改为 `in-progress`
2. 从 `worklog.md` 的 `Task Checklist` 读取所有未完成任务，并按 `Source: P*` 分组，形成“全部剩余未完成 `P*` 队列”
3. 如果仍有任一 `P*` 没有被放入队列或没有关联 `T*`，视为 artifact set 不一致：记录 blocker 并停止
4. 检查是否命中 multiAgent 触发条件：
   - 用户消息显式包含 `--mutiAgent`
   - 用户明确表达“开启多个 agent / 多个 subagent / 并行实现多个实现包”之类的并行实现意图
5. 若未命中，严格按 `P*` 顺序执行；当前 `P*` 下的多个 `T*` 视为一个实现包，并且该包必须先委派给 subagent
6. 若命中，则主 agent 直接判断这些 `P*` 是否彼此独立：
   - 若独立，进入 multiAgent 模式
   - 若不独立，退回串行模式，并在 `Execution Notes` 记录降级原因
7. 进入 multiAgent 模式后：
   - 先由主 agent 划分彼此独立的 `P*` 实现包
   - 只有独立包才允许并行调用多个 subagent 分别处理不同 `P*`
   - 主 agent 在所有相关结果返回后统一审核、去重冲突并决定哪些结果可以接收
8. 对每个待执行的 `P*` 实现包，主 agent 都必须先按 `prompts/subagent-implementation-prompt.md` 组织约束，然后调用 subagent；不得跳过该步骤直接由主 agent 编码
9. subagent 返回后，主 agent 必须先审核以下内容，再决定是否接受该轮实现：
   - 改动是否只覆盖当前 `P*` 及其关联 `T*`
   - 是否引入 spec 外行为或隐含假设
   - 验证是否真实且足以支撑当前完成判定
   - 是否还存在需要记录的 deviation / risk / blocker
10. 如果 subagent 返回结果不足以支撑当前 `P*` 包完成判定，主 agent 只能执行以下动作之一：

- 带着更严格的边界与缺口说明，重新派发同一 `P*` 给 subagent
- 把当前 `P*` 缩小为更清晰的单个实现包后，再派发 subagent
- 记录 blocker / deviation 并停止
- 不允许主 agent 直接补写当前 `P*` 的产品代码实现

11. 对当前 `P*` 包内的每个 `T*`，都必须单独判断完成状态并更新 `worklog.md`：

- `[ ]` → `[x]`：已完成且验证通过
- `[ ]` → `[~]`：已做最小可接受实现，但仍有已知问题

12. 在 `worklog.md` 的 `Execution Notes` 中记录：

- 来源点 ID（`P*`）
- 任务 ID
- 修改文件
- 实际验证
- 与原计划的偏差（如有）
- 执行主体：`subagent` / `main-agent`

13. 在继续下一个串行 `P*` 或结束一轮并行归并前，主代理必须重新读取刚写回的 `worklog.md` 与 `spec.md`，确认 checklist / execution notes 已落盘且与当前代码状态一致，并重新计算剩余未完成 `P*`
14. 只要仍存在未处理完成且未阻塞的 `P*`，就必须继续进入下一轮 `P*` 派发；不得提前收尾

### 步骤 4：阻塞处理

如果执行中遇到以下任一情况，必须先按最保守路径尝试消化；只有在无法安全消化时才停止：

- `spec.md` 没写清楚预期行为
- 当前任务存在两个以上合理实现方向
- 为完成当前任务必须改动 spec 范围之外的行为
- 缺少依赖信息、环境条件或必要输入

处理方式：

- 先把当前采用的保守解释写入 `worklog.md` 的 `Execution Notes`
- 如果保守解释可行，则沿该路径继续，并把对应任务标成 `[x]` 或 `[~]`
- 如果当前轮仍无法安全继续，再用 `templates/blocker-note.md` 的格式把 blocker 写入 `worklog.md` 的 `Execution Notes`
- 把 `spec.md` 状态更新为 `blocked`（如确有阻塞）
- 直接结束 implement，本轮不再等待用户澄清

subagent 相关补充：

- 如果 subagent 的结果无法证明其实现满足当前 `P*` 包内相关 `T*`，主 agent 不得直接接受；必须重派该 `P*`、缩小边界后重派，或记录 blocker
- 如果 subagent 已经做出 spec 外改动，主 agent 必须先记录 deviation，再决定回退、修正或向用户澄清
- 如果 subagent 返回的信息不足以支持 checklist 更新，则当前 `P*` 包内对应 `T*` 维持未完成
- 如果当前环境无法调用 subagent，则不能降级为主 agent 直接实现；必须记录 blocker 并停止
- 如果 multiAgent 模式下多个 subagent 的结果存在冲突、共享依赖或交叉改动，主 agent 必须暂停继续并行接收，先退回串行编排，再按单个 `P*` 重新派发；不得自己直接修补这些 `P*` 的产品代码冲突

额外规则：

- 如果问题不是“无法继续”，而是“已经偏离 spec / 已做了 spec 外实现 / 还没回写就继续写代码”，也必须立即写一条 execution note 记录 deviation
- deviation note 写完前，不得继续编码

### 步骤 5：验证规则

每个有意义的改动后，都要做至少一个具体验证：

- `lsp_diagnostics`
- 定向测试
- typecheck / lint / build（按影响范围选择）
- 必要的手动路径验证

没有具体验证，不得宣称完成。

验证与回写绑定规则：

- `T*` 只有在验证结果已写入 `worklog.md` 的 `Execution Notes` 后，才能标成 `[x]`
- 如果代码已改但验证失败 / 缺失，只能标 `[~]` 或保持未完成，并在 notes 中说明原因
- 如果当前环境无法执行预定验证，必须把“无法验证的原因”和“未验证风险”写入 `Execution Notes`
- 若验证由 subagent 执行，主 agent 仍需判断验证是否覆盖当前 `P*` 包内各个 `T*` 的验收要求、是否存在遗漏；必要时补跑一轮主 agent 自己的定向验证
- 若采用 multiAgent 模式，主 agent 还需额外判断并行结果之间是否引入回归、覆盖顺序问题或共享文件冲突；必要时补跑一轮交叉验证
- implement 阶段的定向验证不能替代 review 阶段的 final verification harness；feature-level 的 `unit` / `e2e` 选择、coverage、success rate 与统一测试报告仍必须在 `sdd-slim-review` 内完成

### 步骤 6：收尾

- 只有在重新计算确认“全部剩余未完成 `P*` 队列已清空”后，且没有遗漏的未完成 `T*`：
  - 全部任务都为 `[x]` 或 `[~]`
  - `spec.md` 状态改为 `implemented` 或 `implemented-with-issues`
  - 输出 changed files / validations / deviations / remaining risks
- 直接停止

## Guardrails

- 优先沿用项目现有模式
- 不做与当前 `P*` 包无关的重构
- 不做投机式清理
- 涉及测试时，补最小但有价值的测试
- 不允许把“先实现再补 spec”当作正常路径；那只能作为 deviation 被记录和纠正
- 标准 implement 阶段禁止通过 `askquestion` 向用户要额外决策；所有额外判断都必须以保守实现、deviation note 或 blocker note 形式在本轮内收口
