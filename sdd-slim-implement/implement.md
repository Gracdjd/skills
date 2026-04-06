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
4. 每完成一个任务就更新同一文件：
   - `[ ]` → `[x]`：已完成且验证通过
   - `[ ]` → `[~]`：已做最小可接受实现，但仍有已知问题
5. 在 `Execution Notes` 中记录：
   - 任务 ID
   - 修改文件
   - 实际验证
   - 与原计划的偏差（如有）

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

### 步骤 5：验证规则

每个有意义的改动后，都要做至少一个具体验证：

- `lsp_diagnostics`
- 定向测试
- typecheck / lint / build（按影响范围选择）
- 必要的手动路径验证

没有具体验证，不得宣称完成。

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
