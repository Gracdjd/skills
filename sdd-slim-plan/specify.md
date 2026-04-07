# SDD Slim Plan — Specify

> 输入：需求文档链接 / 需求文档 / PRD / 长需求文本 / bug 需求 / 重构需求
> 中间产物：`.sdd-slim/<feature-name>.requirement.md`
> 输出：`.sdd-slim/<feature>.spec.md`

## 单文档策略（CRITICAL）

本流程只维护一个 canonical `*.spec.md`：

- 它同时承载 spec（what / why）+ 计划（how）+ task checklist
- 默认不创建 `tasks.md`、`plan.md`、`progress.md`
- implement、review、fix 也都优先回写这个 spec 文件

## HARD GATES

- 必须先通过 requirement-fetch 子代理获取 / 归一化需求并落盘，再做任何拆分或代码探索
- 如果输入是链接，requirement-fetch 子代理必须调用相应 MCP / 工具抓取正文，而不是只记录链接
- 本轮需求归档必须写到 `.sdd-slim/<feature-name>.requirement.md`
- requirement-fetch 必须通过 subagent 执行；外部链接 / 第三方文档优先 `librarian`，本地文件 / 仓库文档优先 `explorer`
- requirement-fetch 子代理一返回，主代理必须立即把结果落盘；不得在落盘前做额外探索、无关推理或长时间等待
- 后续拆分、澄清、研究、任务化都只能基于已落盘的 requirement archive 与用户后续补充
- `sdd-slim-plan` 绝不写产品代码
- 每个需求点必须编号为 `P1`、`P2`...
- 每个歧义点必须编号为 `Q1`、`Q2`...
- 每个 `Q*` 必须通过 `askquestion` 单独澄清
- 每个 `P*` 必须至少通过一次 `askquestion` 让用户确认这一点的理解 / 边界 / 预期结果
- 每个 `P*` 在写入 `Task Checklist` 前，必须先调用 **explorer 子代理** 做代码库探索
- explorer 子代理必须负责给出 grounded 的 HOW 建议
- **每个 `P*` 必须逐个顺序处理，严禁并发调用多个 explorer 子代理**
- **explorer 返回后，主代理必须先确认 HOW 正确性，再写入 spec；HOW 不正确则重新调用 explorer**
- 如果 explorer 返回新的未决问题，必须把它们转成 `Q*` 并继续用 `askquestion` 逐个关闭
- 如果 requirement-fetch 或 explorer 已经暴露阻塞性问题，主代理必须在写完 spec 后立即发出下一个 `askquestion`，不得长时间延后提问
- 只有当某个 `P*` 已完成代码研究、用户确认、验收标准与验证方式明确后，才能生成 `T*`
- **所有 `P*` 和 `Q*` 处理完成后，必须执行整体连贯性分析，确认任务可串接且无漏洞**
- **连贯性分析发现漏洞时，必须通过 `askquestion` 向用户确认补充方案**
- spec 完成后直接停止；不得询问是否执行 `sdd-slim-implement`
- 不得自动触发任何其他 skill

## 流程

### 步骤 1：获取并归档 requirement

1. 根据需求生成 provisional kebab-case 的 `<feature-name>`
2. 默认 requirement archive 路径：`.sdd-slim/<feature-name>.requirement.md`
   - 若 `.sdd-slim/` 不存在，先创建该目录
3. 使用 `prompts/requirement-fetch-task-prompt.md` 启动 requirement-fetch 子代理
   - 外部链接 / 第三方文档优先使用 `librarian`
   - 本地文件 / 仓库文档优先使用 `explorer`
   - wiki 链接（`wiki.17u.cn` / `toca.17u.cn`）使用 `mcp__tc-wiki__matrix-wiki-get`
   - 用户的完整输入（包括链接和链接外的补充文本）都应作为需求来源传入子代理
4. requirement-fetch 子代理必须返回：
   - requirement 标题
   - 原始来源（URL / pasted text / local file）
   - 获取方式（调用了哪些 MCP / 工具）
   - 归一化后的 markdown 正文
   - 仍然缺失或无法访问的内容
5. 主代理在子代理返回后立即把结果写入 `.sdd-slim/<feature-name>.requirement.md`
6. 如果返回 `Follow-up needed before planning` 非 `none`：
   - 继续步骤 2，仅用于定位 / 创建 spec
   - 把每一项转成 `Q*`，写入 `Clarification Log` / `Pending User Input`
   - 将 spec 状态标记为 `needs-user-input`
   - 在当前轮立即通过 `askquestion` 发出第一个阻塞 `Q*`
   - 发出问题后直接停止，不得进入需求拆分、代码探索或 `T*` 生成
7. 如果没有阻塞项，后续 planning 必须先读取这个 requirement archive，并以它作为 canonical requirement input

#### requirement-fetch 子代理约束

- 只负责获取 / 归一化需求，不做规划
- 不做 `P*` / `Q*` / `T*` 拆分
- 不做代码库探索
- 必须尽量保留原始结构与语义
- 如果内容抓取不完整，必须明确记录缺口，不能脑补
- `Follow-up needed before planning` 只记录真正阻塞后续 planning 的缺口；无阻塞则写 `none`

prompt 模板见 `prompts/requirement-fetch-task-prompt.md`。

### 步骤 2：定位或创建 canonical spec

1. 复用步骤 1 里已经确定的 provisional `<feature-name>`
2. 默认路径：`.sdd-slim/<feature-name>.spec.md`
3. 如果已经存在多个高度相关的 `*.spec.md` 且用户没有明确指定：
   - 使用 `askquestion` 让用户选择目标 spec
4. 如果用户选择了现有 spec，且其 slug 与 provisional `<feature-name>` 不一致：
   - 以该现有 spec 的 slug 作为 canonical `<feature-name>`
   - 立即把 requirement archive 重命名为 `.sdd-slim/<canonical-feature-name>.requirement.md`
   - 后续所有引用都使用重命名后的路径
5. 如果不存在目标 spec，则用 `templates/spec.md` 创建骨架

### 步骤 3：拆分需求

先把 `.sdd-slim/<feature-name>.requirement.md` 拆成：

- `Requirement Summary`
- `Requirement Breakdown`
- `Clarification Log`

规则：

- 文档型需求必须拆成 `P*` / `Q*`
- 普通短需求也至少形成 `P1`
- 只要当前信息不足以形成稳定执行路径，就写成 `Q*`

### 步骤 4：先逐个关闭基础 `Q*`

对每个 `Q*`：

1. 使用 `askquestion`
2. 一次只问一个问题
3. 如果当前轮刚写完 requirement / spec 且已存在阻塞 `Q*`，必须立刻先问第一个 `Q*`
4. 用户回答后立即回写 spec
5. 明确关闭后再继续后续 `P*`

### 步骤 5：对每个 `P*` 执行”探索 → 确认 HOW → 写入 → 用户确认 → 任务化”

对每个需求点 `P*`，**逐个顺序**执行以下闭环（严禁并发调用多个 explorer）：

1. 调用 **explorer 子代理** 搜索代码库（参考 `prompts/explorer-task-prompt.md`）
2. explorer 子代理必须返回：
   - 入口文件
   - 涉及模块
   - 可复用实现
   - HOW 建议
   - 候选任务拆分
   - 验证建议
   - 风险
   - 仍需用户补充的信息
3. **确认 HOW 正确性**：主代理在收到 explorer 返回结果后，先自行审查 HOW 建议是否：
   - 基于现有代码模式（而非凭空发明）
   - 改动范围合理（最小化且不破坏现有功能）
   - 任务拆分粒度适当
   - 验证方式可落地
   - 如果 HOW 不正确或不充分，**重新调用 explorer 子代理**对该 P* 再次探索，附加上次探索的不足之处作为补充指令，直到 HOW 足够正确
4. HOW 确认正确后，把子代理结论回写到 spec 的 `Research Findings`（参考 `prompts/research-summary-output.md`）
5. 如果子代理返回 `Questions requiring user input`：
   - 把它们登记到 `Clarification Log` / `Pending User Input`
   - 使用 `askquestion` 逐个询问（参考 `prompts/clarification-question.md`）
   - 回答后必要时重新探索当前 `P*`（回到步骤 1）
6. 当当前 `P*` 的研究结果已足够清晰且 HOW 已确认正确时：
   - 使用 `askquestion` 对这一整个 `P*` 做一次用户确认（参考 `prompts/point-confirmation-question.md`）
   - 这一问必须包含：当前理解、代码依据、建议 HOW、候选任务、建议验证
7. 用户确认后，才允许把当前 `P*` 写成一个或多个 `T*`
8. **只有当前 `P*` 完全处理完毕后，才进入下一个 `P*`**

#### explorer 子代理约束

- 只返回结构化摘要，不要贴原始搜索输出
- HOW 必须基于现有代码模式
- 不允许凭空设计与项目风格冲突的新架构
- 如果信息不足，不要硬编任务，必须明确写出 `Questions requiring user input`

prompt 模板见 `prompts/explorer-task-prompt.md`。  
`Q*` 提问模板见 `prompts/clarification-question.md`。  
`P*` 确认模板见 `prompts/point-confirmation-question.md`。

### 步骤 6：生成 Task Checklist

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

### 步骤 7：整体连贯性分析（CRITICAL）

**所有 `P*` 和 `Q*` 都已处理完毕后**，在生成最终 `Task Checklist` 之前，必须执行一次整体连贯性分析。

参考 `prompts/coherence-check-prompt.md` 执行以下检查：

1. **任务串接检查**：所有 `T*` 是否能按依赖关系串成完整的执行路径，是否存在断裂
2. **遗漏检查**：原始需求中是否有未被任何 `P*`/`T*` 覆盖的点
3. **冲突检查**：不同 `T*` 之间是否存在互相矛盾或冲突的改动范围
4. **边界检查**：各 `T*` 的验收标准是否足以覆盖端到端场景
5. **依赖检查**：`T*` 之间的执行顺序依赖是否明确且合理

分析结果处理：

- 如果发现漏洞/断裂/遗漏：
  - 把问题整理成具体的 `askquestion`，向用户确认补充方案
  - 用户回答后，相应更新 spec（新增/修改 `P*`/`T*`，或调整 HOW）
  - 如果需要重新探索某个 `P*`，回到步骤 5 对该 `P*` 重新执行闭环
- 如果无漏洞：直接进入步骤 8

### 步骤 8：确定 spec 状态并收尾

状态规则：

- 所有关键问题都已闭合，所有 `P*` 都已完成用户确认并形成可执行 `T*` → `ready`
- 还存在未决 `Q*`、spec 冲突、多个候选 spec、或某些 `P*` 仍缺用户输入 → `needs-user-input`

收尾输出只包含：

- requirement archive 路径
- spec 路径
- spec 状态
- 写入了多少个 `P*` / `Q*` / `T*`
- 还缺哪些用户输入（如有）

然后直接停止。

## 明确禁止

- 不得在收尾时询问“是否执行 sdd-slim-implement”
- 不得调用任何其他 skill
- 不得把 planning 阶段偷偷延长成 implementation
