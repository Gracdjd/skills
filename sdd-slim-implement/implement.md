# SDD Slim Implement — Execute Spec

> 输入：一个已确认的 `.sdd-slim/*.spec.md`
> 输出：实现代码 + 更新后的同一 spec 文件

## 单文档策略（CRITICAL）

本阶段继续使用同一个 canonical `*.spec.md`：

- 不单独创建 `tasks.md`
- 任务进度直接更新在 `Task Checklist`
- 实现记录直接追加到 `Execution Notes`

## Context Reset Preflight（CRITICAL）

进入实现前，先做一次上下文重置预处理：

- 如果当前环境暴露了可调用的 `clear` / reset / session-reset 工具，先调用一次
- 否则，如果当前环境支持 new session / fresh run，优先在新 session 中开始 implement
- 否则，如果当前环境支持 `compact` / `compress`，可以作为降级方案使用，但必须明确说明它不等价于真正 clear
- 如果以上能力都没有，不要伪造它们；改为把 implement 当成一次 fresh-context pass
- 无论走哪条路径，后续都必须重新读取 spec，并只以“选定 spec + 当前代码”为事实来源

## HARD GATES

- 只能由用户显式触发 `sdd-slim-implement`
- 编码前必须完整读取选定的 spec 文件
- 如果存在多个候选 `*.spec.md` 且用户未指定，使用 `askquestion` 让用户选择
- 如果 spec 状态不是 `ready` / `in-progress`，直接记录 blocker 并停止
- 只执行已确认的 `T*`；禁止静默扩 scope
- 默认采用 subagent-first：能被清晰边界化的单个 `T*` 实现、定向检索、定向验证，优先交给 subagent；主 agent 负责最终审核与状态裁定
- 主 agent 必须保留以下职责，不能外包：spec 事实来源确认、任务顺序推进、checklist/execution notes 回写、deviation/blocker 判定、最终完成判定
- subagent 一次只处理一个当前 `T*` 或一个紧密耦合的小改动包；若需要跨多个 `T*` 协调，必须拆回主 agent 编排
- 实现过程中，spec 必须持续保持与当前真实进度同步；代码进度不得领先于 spec 回写超过一个正在执行的 `T*`
- 每完成一个 `T*` 后，必须先回写 spec，再开始下一个 `T*`
- 如果发现当前实现依赖 spec 未写明的假设、需要新增任务、或需要改动未列入 `T*` 的行为边界，必须先停下：要么 `askquestion`，要么记录 blocker/deviation，禁止继续偷跑实现
- 如果实现过程中已经发生偏离（例如跳过回写、先写了多项代码、或先实现后对照 spec），必须先把已发生的事实补写回 spec，再继续任何开发动作
- 实现中出现新的歧义或缺失信息时，可以用 `askquestion` 单独澄清
- 不得自动进入 `sdd-slim-review` 或 `sdd-slim-fix`
- 不得自动进入任何其他 skill

## 流程

### 步骤 0：执行 context-reset preflight

1. 检查当前环境是否真的提供 `clear` / reset / session-reset 工具
2. 有则调用一次
3. 没有则检查是否支持 new session / fresh run：
   - 支持则在新 session 中重新开始 implement
4. 如果也不支持新 session，再检查是否支持 `compact` / `compress`：
   - 支持则执行一次压缩，并明确声明这是 fallback，不是 clear
5. 如果以上都不支持，则明确切换成 fresh-context 思维：
   - 不依赖 plan 阶段的对话记忆
   - 重新读取 spec
   - 重新读取当前代码

### 步骤 1：选择目标 spec

- 找到 0 个：停止，并说明应先运行 `sdd-slim-plan`
- 找到 1 个：使用它
- 找到多个且用户未指定：用 `askquestion` 让用户选择

### 步骤 2：读取并检查 spec

至少确认以下 section 存在且可执行：

- Confirmed Scope
- Acceptance Criteria
- Task Checklist
- Verification entries for each `T*`

如果缺失以上任一关键内容：

- 记录 blocker
- 停止

### 步骤 3：开始实现

1. 把状态改为 `in-progress`
2. 从 `Task Checklist` 读取所有 `[ ]` 任务
3. 严格按顺序执行
4. 对当前 `T*` 先判断是否适合委派给 subagent：
   - 适合：由主 agent 明确任务边界、相关文件、禁止扩 scope 的约束、期望验证，然后调用 subagent 执行
   - 不适合：由主 agent 直接实现，但仍遵守同样的边界与验证要求
5. subagent 返回后，主 agent 必须先审核以下内容，再决定是否接受该轮实现：
   - 改动是否只覆盖当前 `T*`
   - 是否引入 spec 外行为或隐含假设
   - 验证是否真实且足以支撑当前完成判定
   - 是否还存在需要记录的 deviation / risk / blocker
6. 每完成一个任务就更新同一文件：
   - `[ ]` → `[x]`：已完成且验证通过
   - `[ ]` → `[~]`：已做最小可接受实现，但仍有已知问题
7. 在 `Execution Notes` 中记录：
   - 任务 ID
   - 修改文件
   - 实际验证
   - 与原计划的偏差（如有）
   - 执行主体：`subagent` / `main-agent`
8. 在开始下一个 `T*` 前，主代理必须重新读取刚写回的 spec，确认 checklist / execution notes 已落盘且与当前代码状态一致

### 步骤 4：阻塞处理

如果执行中遇到以下任一情况，必须先澄清，无法澄清再停止：

- spec 没写清楚预期行为
- 当前任务存在两个以上合理实现方向
- 为完成当前任务必须改动 spec 范围之外的行为
- 缺少依赖信息、环境条件或必要输入

处理方式：

- 优先使用 `askquestion` 做单点澄清
- 如果当前轮仍无法继续，再用 `templates/blocker-note.md` 的格式把 blocker 写入 `Execution Notes`
- 把 spec 状态更新为 `blocked`（如确有阻塞）
- 直接停止，等待用户手动再次调用

subagent 相关补充：

- 如果 subagent 的结果无法证明其实现满足当前 `T*`，主 agent 不得直接接受，必须补做审核、追加验证，或改为主 agent 接手修正
- 如果 subagent 已经做出 spec 外改动，主 agent 必须先记录 deviation，再决定回退、修正或向用户澄清
- 如果 subagent 返回的信息不足以支持 checklist 更新，则该 `T*` 维持未完成

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

- `T*` 只有在验证结果已写入 `Execution Notes` 后，才能标成 `[x]`
- 如果代码已改但验证失败/缺失，只能标 `[~]` 或保持未完成，并在 notes 中说明原因
- 如果当前环境无法执行预定验证，必须把“无法验证的原因”和“未验证风险”写入 `Execution Notes`
- 若验证由 subagent 执行，主 agent 仍需判断验证是否与当前 `T*` 直接对应、是否存在遗漏；必要时补跑一轮主 agent 自己的定向验证

### 步骤 6：收尾

- 全部任务都为 `[x]` 或 `[~]` 后：
  - 状态改为 `implemented` 或 `implemented-with-issues`
  - 输出 changed files / validations / deviations / remaining risks
- 直接停止

## Guardrails

- 优先沿用项目现有模式
- 不做与当前 `T*` 无关的重构
- 不做投机式清理
- 涉及测试时，补最小但有价值的测试
- 不允许把“先实现再补 spec”当作正常路径；那只能作为 deviation 被记录和纠正
