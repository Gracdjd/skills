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

- 主代理必须直接基于**当前用户输入**启动 planning；不得先回复“请提供需求来源 / 请选择需求类型 / 您希望规划哪个功能”之类的通用收集话术
- 如果当前用户输入里含有需求文档链接，主代理必须直接处理该链接，并把同条消息中的补充文本一并纳入 requirement 归档
- 如果当前用户输入里没有需求文档链接，但已经包含需求描述、PRD、bug 描述、重构意图或其他可分析内容，主代理必须直接基于这些内容生成 requirement archive
- 在 requirement 归档开始前不得用普通对话向用户追问输入类型；进入 planning 后，所有 `Q*` 澄清与每个 `P*` 的用户确认都必须通过 `askquestion` 完成
- 必须先由主代理直接获取 / 归一化需求并落盘，再做任何拆分或代码探索
- 主代理在 requirement 归档时必须先判断：当前输入里是否**真的存在可用的需求文档正文**，并给出 `available | partial | missing` 结论
- 如果输入是链接，主代理必须调用相应 MCP / 工具抓取正文，而不是只记录链接
- `产品` / `开发` / `开发工时` / `项目` 等元信息只能视为上下文，**不能单独当作需求文档正文**
- 如果用户输入里存在重复链接、重复粘贴段落或“链接 + 同内容粘贴”，主代理必须先去重，再生成 requirement archive
- 本轮需求归档必须写到 `.sdd-slim/<feature-name>.requirement.md`
- requirement 归档必须由主代理直接执行；如需读取外部链接 / 第三方文档 / 本地文件，主代理直接调用相应 MCP / 工具
- requirement 内容一旦整理完成，主代理必须立即把结果落盘；不得在落盘前做额外探索、无关推理或长时间等待
- 后续拆分、澄清、研究、任务化都只能基于已落盘的 requirement archive 与用户后续补充
- `sdd-slim-plan` 绝不写产品代码
- 每个需求点必须编号为 `P1`、`P2`...
- 每个歧义点必须编号为 `Q1`、`Q2`...
- 每个 `Q*` 必须通过 `askquestion` 单独澄清
- 每个 `P*` 在完成代码研究并写入研究结论后，都必须通过 `askquestion` 向用户确认一次；即使当前输入、requirement archive 与代码研究已经足够明确，也不得跳过这次确认
- 每个 `P*` 在写入 `Task Checklist` 前，必须先调用 **subagent** 做代码库探索
- subagent 必须负责给出 grounded 的 HOW 建议
- **每个 `P*` 必须逐个顺序处理，严禁并发调用多个 subagent**
- **subagent 返回后，主代理必须先确认 HOW 正确性，再写入 spec；HOW 不正确则重新调用 subagent**
- 如果 subagent 返回新的未决问题，必须把它们转成 `Q*` 并继续用 `askquestion` 逐个关闭
- 如果 requirement 归档阶段或 subagent 已经暴露阻塞性问题，主代理必须在写完 spec 后立即发出下一个 `askquestion`，不得长时间延后提问
- 只有当某个 `P*` 已完成代码研究、用户确认、验收标准与验证方式明确后，才能生成 `T*`
- **所有 `P*` 和 `Q*` 处理完成后，必须执行整体连贯性分析，确认任务可串接且无漏洞**
- **连贯性分析发现漏洞时，必须通过 `askquestion` 向用户确认补充方案**
- spec 完成后直接停止；不得询问是否执行 `sdd-slim-implement`
- 不得自动触发任何其他 skill

## 流程

### 步骤 1：获取并归档 requirement

1. 先直接解析当前用户输入，自动识别以下来源组合，而不是反问用户属于哪一种：
   - 链接（wiki / PRD / 云文档 / 设计稿等）
   - 粘贴正文
   - bug 描述
   - 重构诉求
   - 伴随元信息（产品 / 开发 / 工时 / 项目等）
2. 根据需求生成 provisional kebab-case 的 `<feature-name>`
3. 默认 requirement archive 路径：`.sdd-slim/<feature-name>.requirement.md`
   - 若 `.sdd-slim/` 不存在，先创建该目录
4. 主代理按 `prompts/requirement-archive-prompt.md` 直接整理 requirement archive
    - 如需读取外部链接 / 第三方文档 / 本地文件正文，主代理直接调用相应 MCP / 工具
    - wiki 链接（`wiki.17u.cn` / `toca.17u.cn`）使用 `mcp__tc-wiki__matrix-wiki-get`
    - 用户的完整输入（包括链接和链接外的补充文本）都应作为需求来源
    - 主代理必须先做**来源判定**：区分“正文存在 / 正文部分存在 / 只有元信息或引用无正文”
    - 主代理必须先做**重复检测**：合并重复来源、折叠重复段落，并记录去重说明
    - 如果没有链接但有可分析文本，也必须直接归一化，不得要求用户重新按某种格式提交
5. 主代理生成的 requirement archive 必须包含：
    - requirement 标题
    - 需求文档可用性（`available | partial | missing`）
    - 原始来源清单（URL / pasted text / local file / metadata-only）
    - 获取方式（调用了哪些 MCP / 工具）
    - 去重说明（如果有）
    - 归一化后的 markdown 正文
    - 仍然缺失或无法访问的内容
6. 主代理整理完成后立即把结果写入 `.sdd-slim/<feature-name>.requirement.md`
7. 如果返回 `Requirement availability` 为 `partial` / `missing`，或 `Follow-up needed before planning` 非 `none`：
    - 继续步骤 2，仅用于定位 / 创建 spec
    - 此时 spec 只允许先写：header、`Clarification Log`、`Pending User Input`，以及可选的仅含 `Q*` 的 `Requirement Breakdown`
    - 在需求正文可用前，不得生成 `P*`、`Research Findings` 或 `T*`
    - 把每一项转成 `Q*`，写入 `Clarification Log` / `Pending User Input`
    - 将 spec 状态标记为 `needs-user-input`
    - 在当前轮立即通过 `askquestion` 发出第一个阻塞 `Q*`
    - 发出问题后直接停止，不得进入需求拆分、代码探索或 `T*` 生成
8. 如果没有阻塞项，后续 planning 必须先读取这个 requirement archive，并以它作为 canonical requirement input

#### 主 Agent requirement 归档约束

- requirement 归档阶段只负责获取 / 归一化需求，不做规划
- 不做 `P*` / `Q*` / `T*` 拆分
- 不做代码库探索
- 必须优先尝试利用当前输入中的现有信息完成 requirement 归档，不能先回问“请提供需求来源”
- 必须先判断输入是否包含可直接用于 planning 的需求正文
- 必须把元信息（如产品、开发、工时、项目）与需求正文分开整理
- 如果发现重复来源或重复段落，必须去重并记录去重说明
- 必须尽量保留原始结构与语义
- 如果内容抓取不完整，必须明确记录缺口，不能脑补
- `Follow-up needed before planning` 只记录真正阻塞后续 planning 的缺口；无阻塞则写 `none`

prompt 模板见 `prompts/requirement-archive-prompt.md`。

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
- 如果 requirement availability 不是 `available`，则不得进入本步骤

### 步骤 4：先逐个关闭基础 `Q*`

对每个 `Q*`：

1. 使用 `askquestion`
2. 一次只问一个问题
3. 如果当前轮刚写完 requirement / spec 且已存在阻塞 `Q*`，必须立刻先问第一个 `Q*`
4. 用户回答后立即回写 spec
5. 明确关闭后再继续后续 `P*`

### 步骤 5：对每个 `P*` 执行”探索 → 确认 HOW → 写入 → 用户确认 → 任务化”

对每个需求点 `P*`，**逐个顺序**执行以下闭环（严禁并发调用多个 subagent）：

1. 调用 **subagent** 搜索代码库（参考 `prompts/subagent-task-prompt.md`）
2. subagent 必须返回：
   - 入口文件
   - 涉及模块
   - 可复用实现
   - HOW 建议
   - 候选任务拆分
   - 验证建议
   - 风险
   - 仍需用户补充的信息
3. **确认 HOW 正确性**：主代理在收到 subagent 返回结果后，先自行审查 HOW 建议是否：
   - 基于现有代码模式（而非凭空发明）
   - 改动范围合理（最小化且不破坏现有功能）
   - 任务拆分粒度适当
   - 验证方式可落地
   - 如果 HOW 不正确或不充分，**重新调用 subagent**对该 P* 再次探索，附加上次探索的不足之处作为补充指令，直到 HOW 足够正确
4. HOW 确认正确后，把 subagent 结论回写到 spec 的 `Research Findings`（参考 `prompts/research-summary-output.md`）
5. 如果子代理返回 `Questions requiring user input`：
    - 把它们登记到 `Clarification Log` / `Pending User Input`
    - 使用 `askquestion` 逐个询问（参考 `prompts/clarification-question.md`）
    - 回答后必要时重新探索当前 `P*`（回到步骤 1）
6. 无论当前 `P*` 是否复杂、是否仍有明显歧义，都必须使用 `askquestion` 对该 `P*` 做一次用户确认（参考 `prompts/point-confirmation-question.md`）
   - 提问内容应总结当前理解、代码依据、建议 HOW、候选任务与验证方式
   - 简单 `P*` 也必须确认，不能因为“已经很明确”而跳过
   - 如果存在额外阻塞边界 / 取舍 / 验收差异，提问可以聚焦这些差异，但仍然属于当前 `P*` 的确认闭环
7. 用户回答后立即回写 spec；如果用户修正了行为、边界或 HOW，必要时重新探索当前 `P*`（回到步骤 1）
8. 当当前 `P*` 的研究结果已足够清晰、HOW 已确认正确，且该 `P*` 的用户确认已完成后，才允许把当前 `P*` 写成一个或多个 `T*`
9. **只有当前 `P*` 完全处理完毕后，才进入下一个 `P*`**

#### subagent 约束

- 只返回结构化摘要，不要贴原始搜索输出
- HOW 必须基于现有代码模式
- 不允许凭空设计与项目风格冲突的新架构
- 如果信息不足，不要硬编任务，必须明确写出 `Questions requiring user input`

prompt 模板见 `prompts/subagent-task-prompt.md`。  
`Q*` 提问模板见 `prompts/clarification-question.md`。  
`P*` 确认模板见 `prompts/point-confirmation-question.md`。

### 步骤 6：生成 Task Checklist

只有当某个 `P*` 同时满足以下条件时，才生成 `T*`：

- 若存在用户侧阻塞问题，则已通过 `askquestion` 完成确认
- subagent 已完成研究
- HOW 已可落地
- 验收标准可写清楚
- 验证方式可写清楚

每个 `T*` 至少要有：

- 任务标题
- 来源点（`P*`）
- 涉及文件
- HOW（来自 subagent 研究结论）
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
