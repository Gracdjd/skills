# SDD Slim Plan — Specify

> 输入：需求文档 / PRD / 长需求文本 / bug 需求 / 重构需求
> 输出：`.sdd-slim/<feature>.spec.md`

## 单文档策略（CRITICAL）

本流程只维护一个 canonical `*.spec.md`：

- 它同时承载 spec（what / why）+ 计划（how）+ task checklist
- 默认不创建 `tasks.md`、`plan.md`、`progress.md`
- implement、review、fix 也都优先回写这个 spec 文件

## HARD GATES

- 必须先读取需求文档 / 需求文本，再做任何拆分或代码探索
- `sdd-slim-plan` 绝不写产品代码
- 每个需求点必须编号为 `P1`、`P2`...
- 每个歧义点必须编号为 `Q1`、`Q2`...
- 每个 `Q*` 必须通过 `askquestion` 单独澄清
- 每个 `P*` 必须至少通过一次 `askquestion` 让用户确认这一点的理解 / 边界 / 预期结果
- 每个 `P*` 在写入 `Task Checklist` 前，必须先调用 **explorer 子代理** 做代码库探索
- explorer 子代理必须负责给出 grounded 的 HOW 建议
- 如果 explorer 返回新的未决问题，必须把它们转成 `Q*` 并继续用 `askquestion` 逐个关闭
- 只有当某个 `P*` 已完成代码研究、用户确认、验收标准与验证方式明确后，才能生成 `T*`
- spec 完成后直接停止；不得询问是否执行 `sdd-slim-implement`
- 不得自动触发任何其他 skill

## 流程

### 步骤 1：定位或创建 canonical spec

1. 根据需求生成 kebab-case 的 `<feature-name>`
2. 默认路径：`.sdd-slim/<feature-name>.spec.md`
3. 如果已经存在多个高度相关的 `*.spec.md` 且用户没有明确指定：
   - 使用 `askquestion` 让用户选择目标 spec
4. 如果不存在目标 spec，则用 `templates/spec.md` 创建骨架

### 步骤 2：拆分需求

先把输入拆成：

- `Requirement Summary`
- `Requirement Breakdown`
- `Clarification Log`

规则：

- 文档型需求必须拆成 `P*` / `Q*`
- 普通短需求也至少形成 `P1`
- 只要当前信息不足以形成稳定执行路径，就写成 `Q*`

### 步骤 3：先逐个关闭基础 `Q*`

对每个 `Q*`：

1. 使用 `askquestion`
2. 一次只问一个问题
3. 用户回答后立即回写 spec
4. 明确关闭后再继续后续 `P*`

### 步骤 4：对每个 `P*` 执行“研究 → 用户确认 → 任务化”

对每个需求点 `P*`，逐个执行以下闭环：

1. 调用 **explorer 子代理** 搜索代码库
2. 子代理必须返回：
   - 入口文件
   - 涉及模块
   - 可复用实现
   - HOW 建议
   - 候选任务拆分
   - 验证建议
   - 风险
   - 仍需用户补充的信息
3. 把子代理结论回写到 spec 的 `Research Findings`
4. 如果子代理返回 `Questions requiring user input`：
   - 把它们登记到 `Clarification Log` / `Pending User Input`
   - 使用 `askquestion` 逐个询问
   - 回答后必要时重新探索当前 `P*`
5. 当当前 `P*` 的研究结果已足够清晰时：
   - 使用 `askquestion` 对这一整个 `P*` 做一次用户确认
   - 这一问必须包含：当前理解、代码依据、建议 HOW、候选任务、建议验证
6. 用户确认后，才允许把当前 `P*` 写成一个或多个 `T*`

#### explorer 子代理约束

- 只返回结构化摘要，不要贴原始搜索输出
- HOW 必须基于现有代码模式
- 不允许凭空设计与项目风格冲突的新架构
- 如果信息不足，不要硬编任务，必须明确写出 `Questions requiring user input`

prompt 模板见 `prompts/explorer-task-prompt.md`。  
`Q*` 提问模板见 `prompts/clarification-question.md`。  
`P*` 确认模板见 `prompts/point-confirmation-question.md`。

### 步骤 5：生成 Task Checklist

只有当某个 `P*` 同时满足以下条件时，才生成 `T*`：

- 用户已通过 `askquestion` 确认该点
- explorer 已完成研究
- HOW 已可落地
- 验收标准可写清楚
- 验证方式可写清楚

每个 `T*` 至少要有：

- 任务标题
- 来源点（`P*`）
- 涉及文件
- HOW（来自 subagent）
- 验收标准
- 验证方式

如果某个 `P*` 还不够清晰：

- 不要强行生成可执行任务
- 把缺失内容写进 `Pending User Input`
- 必要时继续用 `askquestion` 澄清
- 可选地写成“draft research only”，但不能伪装成 ready task

### 步骤 6：确定 spec 状态并收尾

状态规则：

- 所有关键问题都已闭合，所有 `P*` 都已完成用户确认并形成可执行 `T*` → `ready`
- 还存在未决 `Q*`、spec 冲突、多个候选 spec、或某些 `P*` 仍缺用户输入 → `needs-user-input`

收尾输出只包含：

- spec 路径
- spec 状态
- 写入了多少个 `P*` / `Q*` / `T*`
- 还缺哪些用户输入（如有）

然后直接停止。

## 明确禁止

- 不得在收尾时询问“是否执行 sdd-slim-implement”
- 不得调用任何其他 skill
- 不得把 planning 阶段偷偷延长成 implementation
