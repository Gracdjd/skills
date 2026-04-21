# SDD Slim Plan — Specify

> 输入：需求文档链接 / 需求文档 / PRD / 长需求文本 / bug 需求 / 重构需求
> Feature Folder：`.sdd-slim/<YYYY.MM.DD>.<feature-name>/`
> 项目级测试基线：`.sdd-slim/_project/test.md`
> 中间产物：`requirement.md`
> 输出：`spec.md` + `plan.md` + `worklog.md`

## Feature Folder 多文档策略（CRITICAL）

本流程不再把所有 planning / execution 信息塞进单个 spec 文件，而是维护一组 canonical artifacts：

- `requirement.md`：主代理归档后的 canonical 需求来源
- `spec.md`：薄的 spec 入口文件，只放 what / why / acceptance / verification / high-level risks
- `plan.md`：planning 明细，承载 `Requirement Breakdown`、`Clarification Log`、`Point Confirmation Log`、`Research Findings`、`Pending User Input`、`Coherence Notes`、`Test Design Handoff`
- `worklog.md`：执行工作账本；planning 阶段只写 `Task Checklist`，implement / review 再继续回写 `Execution Notes`、`Review Findings`、`Repair Notes`、`Verification Harness Report`
- `.sdd-slim/_project/test.md`：项目级持久回归基线，记录每个需求收尾时都要重跑的 suite / journey / coverage policy

实现、review 与 final harness 之后优先回写 `worklog.md`，不是把所有痕迹继续堆进 `spec.md`。

## HARD GATES

- 主代理必须直接基于当前用户输入启动 planning；不得先回复“请提供需求来源 / 请选择需求类型 / 您希望规划哪个功能”之类的通用收集话术
- 如果当前用户输入里含有需求文档链接，主代理必须直接处理该链接，并把同条消息中的补充文本一并纳入 requirement 归档
- 如果当前用户输入里没有需求文档链接，但已经包含需求描述、PRD、bug 描述、重构意图或其他可分析内容，主代理必须直接基于这些内容生成 requirement archive
- 在 requirement 归档开始前不得用普通对话向用户追问输入类型；进入 planning 后，所有 `Q*` 澄清与每个 `P*` 的用户确认都必须通过 `askquestion` 完成
- 必须先由主代理直接获取 / 归一化需求并落盘，再做任何拆分或代码探索
- 主代理在 requirement 归档时必须先判断：当前输入里是否真的存在可用的需求文档正文，并给出 `available | partial | missing` 结论
- 如果输入是链接，主代理必须调用相应 MCP / 工具抓取正文，而不是只记录链接
- `产品` / `开发` / `开发工时` / `项目` 等元信息只能视为上下文，不能单独当作需求文档正文
- 如果用户输入里存在重复链接、重复粘贴段落或“链接 + 同内容粘贴”，主代理必须先去重，再生成 requirement archive
- 本轮需求归档必须写到 `.sdd-slim/<YYYY.MM.DD>.<feature-name>/requirement.md`
- planning 阶段必须确保 `.sdd-slim/_project/test.md` 存在；若不存在，先用模板创建 skeleton，后续需求都复用这一份项目级回归基线
- requirement 归档必须由主代理直接执行；如需读取外部链接 / 第三方文档 / 本地文件，主代理直接调用相应 MCP / 工具
- requirement 内容一旦整理完成，主代理必须立即把结果落盘；不得在落盘前做额外探索、无关推理或长时间等待
- 后续拆分、澄清、研究、任务化都只能基于已落盘的 requirement archive 与用户后续补充
- `sdd-slim-plan` 绝不写产品代码
- 每个需求点必须编号为 `P1`、`P2`...
- 每个歧义点必须编号为 `Q1`、`Q2`...
- 每个 `Q*` 必须通过 `askquestion` 单独澄清
- 每个 `P*` 在完成代码研究并写入研究结论后，都必须通过 `askquestion` 向用户确认一次；即使当前输入、requirement archive 与代码研究已经足够明确，也不得跳过这次确认
- 每个 `P*` 在写入 `worklog.md` 的 `Task Checklist` 前，必须先调用 subagent 做代码库探索
- subagent 必须负责给出 grounded 的 HOW 建议
- 主代理不得用自己直接搜索/读取代码得到的结论，替代 `P*` 所要求的 subagent 研究步骤；主代理直接搜索只能用于 requirement 归档或补充校验，不能替代 `P*` 研究闭环
- 不仅 `P*`，plan 阶段任何代码库探索任务都必须通过 subagent 执行，包括但不限于：入口定位、调用链核实、现有模式对齐、依赖确认、风险定位、验证路径识别、coherence gap 复核
- 主代理在 plan 阶段不得因为“只是补充看一眼代码”“只是确认一个文件”而直接自己做 repo exploration；只要目的属于代码库探索，就必须走 subagent
- 默认每个 `P*` 逐个顺序处理；只有在检测到 `--mutiAgent` 或用户明确要求开启多个 subagent，并通过 `askquestion` 获得明确同意后，才允许切换到 multiAgent 并行探索模式
- multiAgent 模式只允许并行执行独立的 repo exploration / research；文档写回、`P*` 用户确认、`Q*` 澄清、任务生成、ready 判定仍由主代理串行完成
- subagent 返回后，主代理必须先确认 HOW 正确性，再写入 `plan.md` / `spec.md` / `worklog.md`；HOW 不正确则重新调用 subagent
- 如果 subagent 返回新的未决问题，必须把它们转成 `Q*` 并继续用 `askquestion` 逐个关闭
- 如果 requirement 归档阶段或 subagent 已经暴露阻塞性问题，主代理必须在写完文档后立即发出下一个 `askquestion`，不得长时间延后提问
- 只有当某个 `P*` 已完成代码研究、用户确认、验收标准与验证方式明确后，才能生成 `T*`
- planning 阶段写入 `worklog.md` 的每个 `T*` 默认就是 implement 阶段的单个 subagent 实现包；不得把“implement 再拆”当作正常路径
- 每个 `T*` 至少必须具备：单一主目标、最小必要文件范围、单一主验证焦点、明确 `Dependencies`
- 如果一个候选 `T*` 同时覆盖多个用户可感知行为、多个关键文件族、多个独立验证路径，或仍需要 implement 主 agent 再次拆包，说明粒度过大，必须在 plan 阶段继续拆分
- plan 阶段必须先写清 feature-level `Verification Strategy` 与 `plan.md` 里的 `Test Design Handoff`；这两个产物定义“测什么”，供 review 阶段落地成最终 unit / e2e 测试代码，但 planning 本身不得生成可执行测试文件
- 所有 `P*` 和 `Q*` 处理完成后，必须执行整体连贯性分析，确认任务可串接且无漏洞
- 连贯性分析发现漏洞时，必须通过 `askquestion` 向用户确认补充方案
- planning 完成后直接停止；不得询问是否执行 `sdd-slim-implement`
- 不得自动触发任何其他 skill

## 流程

### 步骤 1：获取并归档 requirement

1. 先直接解析当前用户输入，自动识别以下来源组合，而不是反问用户属于哪一种：
   - 链接（wiki / PRD / 云文档 / 设计稿等）
   - 粘贴正文
   - bug 描述
   - 重构诉求
   - 伴随元信息（产品 / 开发 / 工时 / 项目等）
2. 根据需求生成 provisional kebab-case 的 `<feature-name>`，并使用 planning 当天日期生成 provisional feature folder：`.sdd-slim/<YYYY.MM.DD>.<feature-name>/`
3. 默认路径：
   - `requirement.md`：`.sdd-slim/<YYYY.MM.DD>.<feature-name>/requirement.md`
   - `spec.md`：`.sdd-slim/<YYYY.MM.DD>.<feature-name>/spec.md`
   - `plan.md`：`.sdd-slim/<YYYY.MM.DD>.<feature-name>/plan.md`
   - `worklog.md`：`.sdd-slim/<YYYY.MM.DD>.<feature-name>/worklog.md`
   - `project test`：`.sdd-slim/_project/test.md`
4. 若 `.sdd-slim/` 或 `.sdd-slim/_project/` 不存在，先创建目录；若 `.sdd-slim/_project/test.md` 不存在，先用模板创建 skeleton
5. 主代理按 `prompts/requirement-archive-prompt.md` 直接整理 requirement archive
   - 如需读取外部链接 / 第三方文档 / 本地文件正文，主代理直接调用相应 MCP / 工具
   - wiki 链接（`wiki.17u.cn` / `toca.17u.cn`）使用 `mcp__hotel-tools__matrix-wiki-get`
   - 用户的完整输入都应作为需求来源
   - 主代理必须先做来源判定：区分“正文存在 / 正文部分存在 / 只有元信息或引用无正文”
   - 主代理必须先做重复检测：合并重复来源、折叠重复段落，并记录去重说明
   - 如果没有链接但有可分析文本，也必须直接归一化，不得要求用户重新按某种格式提交
6. 主代理整理完成后立即把结果写入 feature folder 下的 `requirement.md`
7. 如果返回 `Requirement availability` 为 `partial` / `missing`，或 `Follow-up needed before planning` 非 `none`：
   - 继续步骤 2，仅用于定位 / 创建 artifact set
   - 此时 `spec.md` 只允许先写 header、`Requirement Summary` 的已知部分、`Risks / Follow-ups`
   - `plan.md` 只允许先写 `Clarification Log`、`Pending User Input`，以及可选的仅含 `Q*` 的 `Requirement Breakdown`
   - `worklog.md` 只创建骨架，不得生成 `Task Checklist`
   - 在需求正文可用前，不得生成 `P*` 的研究结论或 `T*`
   - 把每一项阻塞内容转成 `Q*`，写入 `plan.md`
   - 将 `spec.md` 状态标记为 `needs-user-input`
   - 在当前轮立即通过 `askquestion` 发出第一个阻塞 `Q*`
   - 发出问题后直接停止，不得进入需求拆分、代码探索或 `T*` 生成
8. 如果没有阻塞项，后续 planning 必须先读取这个 requirement archive，并以它作为 canonical requirement input

#### 主 Agent requirement 归档约束

- requirement 归档阶段只负责获取 / 归一化需求，不做规划
- 不做 `P*` / `Q*` / `T*` 拆分
- 不做代码库探索
- 必须优先尝试利用当前输入中的现有信息完成 requirement 归档，不能先回问“请提供需求来源”
- 必须先判断输入是否包含可直接用于 planning 的需求正文
- 必须把元信息与需求正文分开整理
- 如果发现重复来源或重复段落，必须去重并记录去重说明
- 必须尽量保留原始结构与语义
- 如果内容抓取不完整，必须明确记录缺口，不能脑补
- `Follow-up needed before planning` 只记录真正阻塞后续 planning 的缺口；无阻塞则写 `none`

prompt 模板见 `prompts/requirement-archive-prompt.md`。

### 步骤 2：定位或创建 canonical artifact set

1. 复用步骤 1 里已经确定的 provisional feature folder
2. 如果已经存在多个高度相关的 dated feature folder 且用户没有明确指定：
   - 使用 `askquestion` 让用户选择目标 feature folder
3. 如果用户选择了现有 feature folder，且其 slug 与 provisional `<feature-name>` 不一致：
   - 以该现有 folder 作为 canonical target
   - 后续所有引用都使用该 folder 下的 `requirement.md`、`spec.md`、`plan.md`、`worklog.md`
4. 如果不存在目标 feature folder，则创建它，并用 `templates/spec.md`、`templates/plan.md`、`templates/worklog.md` 初始化骨架
5. planning 阶段对各文件的职责固定如下：
   - `spec.md`：Requirement Summary、Confirmed Scope、Acceptance Criteria、Verification Strategy、Risks / Follow-ups
   - `plan.md`：Requirement Breakdown、Clarification Log、Point Confirmation Log、Research Findings、Pending User Input、Coherence Notes
   - `worklog.md`：Task Checklist

### 步骤 3：拆分需求

先把 `requirement.md` 拆成：

- `spec.md` 的 `Requirement Summary`
- `plan.md` 的 `Requirement Breakdown`
- `plan.md` 的 `Clarification Log`

规则：

- 文档型需求必须拆成 `P*` / `Q*`
- 普通短需求也至少形成 `P1`
- 只要当前信息不足以形成稳定执行路径，就写成 `Q*`
- 如果 requirement availability 不是 `available`，则不得进入本步骤

### 步骤 4：先逐个关闭基础 `Q*`

对每个 `Q*`：

1. 使用 `askquestion`
2. 一次只问一个问题
3. 如果当前轮刚写完 requirement / artifact set 且已存在阻塞 `Q*`，必须立刻先问第一个 `Q*`
4. 用户回答后立即回写 `plan.md`，必要时同步修正 `spec.md`
5. 明确关闭后再继续后续 `P*`

### 步骤 5：对每个 `P*` 执行“探索 → 确认 HOW → 写入 → 用户确认 → 任务化”

对每个需求点 `P*`，默认逐个顺序执行以下闭环；如果已按规则进入 multiAgent 模式，则只放开“探索”这一步的并行度，后续仍串行收口。

#### multiAgent 模式开关（CRITICAL）

在进入任何并行探索前，主代理必须先检查是否出现以下任一触发信号：

- 用户消息显式包含 `--mutiAgent`
- 用户明确要求“开启多个 subagent / 多个 agent 并行探索 / 并行研究代码库”

如果命中触发信号：

1. 主代理必须立即通过 `askquestion` 单独询问是否确认开启多个 agent 并行完成 plan 阶段探索（参考 `prompts/multi-agent-confirmation-question.md`）
2. 只有收到明确肯定答复，才能开启 multiAgent 模式
3. 如果用户拒绝、保持沉默、回答模糊，或当前问题不是明确肯定，继续使用默认串行模式

串行模式下，对每个需求点 `P*` 逐个执行以下闭环：

1. 调用 subagent 搜索代码库（参考 `prompts/subagent-task-prompt.md`）
2. subagent 必须返回：
   - 入口文件
   - 涉及模块
   - 可复用实现
   - HOW 建议
   - 候选任务拆分（按 implement-ready `T*` 包拆分，并标注依赖）
   - 验证建议
   - 候选 unit cases / e2e journeys
   - 建议测试文件落点
   - 风险
   - 仍需用户补充的信息
3. 主代理在收到 subagent 返回结果后，先自行审查 HOW 建议是否：
   - 基于现有代码模式，而非凭空发明
   - 改动范围合理
   - 任务拆分粒度适当，且每个候选 `T*` 都已经小到可被 implement 阶段单独派发给 subagent
   - 验证方式可落地
   - 如果 HOW 不正确或不充分，重新调用 subagent 对该 `P*` 再次探索，直到 HOW 足够正确
4. HOW 确认正确后，把 subagent 结论回写到 `plan.md` 的 `Research Findings`，并同步更新 `spec.md` 的范围 / 验收 / 验证信息
5. 如果子代理返回 `Questions requiring user input`：
   - 把它们登记到 `plan.md` 的 `Clarification Log` / `Pending User Input`
   - 使用 `askquestion` 逐个询问
   - 回答后必要时重新探索当前 `P*`
6. 无论当前 `P*` 是否复杂、是否仍有明显歧义，都必须使用 `askquestion` 对该 `P*` 做一次用户确认
   - 提问内容应总结当前理解、代码依据、建议 HOW、候选任务与验证方式
   - 简单 `P*` 也必须确认，不能因为“已经很明确”而跳过
7. 用户回答后立即回写 `plan.md` 的 `Point Confirmation Log`；如果用户修正了行为、边界或 HOW，必要时重新探索当前 `P*`
8. 当当前 `P*` 的研究结果已足够清晰、HOW 已确认正确，且该 `P*` 的用户确认已完成后，才允许把当前 `P*` 写成一个或多个 `T*` 到 `worklog.md` 的 `Task Checklist`
9. 只有当前 `P*` 完全处理完毕后，才进入下一个 `P*`

multiAgent 模式下的补充规则：

1. 主代理先把多个彼此独立的 `P*` 或研究问题切成独立探索包
2. 每个 subagent 一次只处理一个探索包，不得跨多个未归并的 `P*`
3. 多个 subagent 可以并行返回研究摘要，但主代理必须先统一审查、去重和消解冲突，再按 `P*` 顺序写入文档
4. `askquestion` 仍然一次只问一个 `P*` 或一个 `Q*`
5. 若并行探索结果互相冲突、依赖关系不清或出现新的共享阻塞，必须暂停并行收口，必要时转成新的 `Q*` 或重新探索

### 步骤 6：生成 Task Checklist、Verification Strategy 与 Test Design Handoff

只有当某个 `P*` 同时满足以下条件时，才生成 `T*`：

- 若存在用户侧阻塞问题，则已通过 `askquestion` 完成确认
- subagent 已完成研究
- HOW 已可落地
- 验收标准可写清楚
- 验证方式可写清楚

在首次生成任何 `T*` 前，必须先写清 `spec.md` 的 feature-level `Verification Strategy`，至少包含：

- `Target Surface`
- `Required Harness`
- `Supporting Lanes`
- `Unit Harness`
- `E2E Harness`
- `Project Regression`
- `Report Requirements`

同时，必须先写清 `plan.md` 的 `Test Design Handoff`，至少包含：

- 当前 `P*` 对应的 required lane
- supporting lanes（如有）
- 候选 unit cases
- 候选 e2e journeys
- 建议测试文件落点
- 供 review 阶段直接生成测试用例的注意事项

生成规则：

- 如果本轮验收包含 web / browser UI，`Required Harness` 默认是 `e2e`
- 如果目标不涉及 web / browser UI，`Required Harness` 默认是 `unit`
- 只有用户明确要求双轨验证，或 spec 已明确两类验证都必须成为 release gate 时，才允许写成 `hybrid`
- 如果 `Required Harness = e2e` 且当前需求仍存在可稳定隔离的组件 / 逻辑边界，`Supporting Lanes` 默认优先写成 `unit`
- 如果 `Required Harness = unit` 且当前需求同时涉及 browser journey，`Supporting Lanes` 可写成 `e2e`
- `Project Regression` 必须引用 `.sdd-slim/_project/test.md`，并写清本需求收尾时至少要重跑哪些项目级基线
- `Report Requirements` 必须明确：最终报告里 unit coverage 与 e2e success rate 两个字段都要出现；未执行的一侧要给出 `skipped` / `blocked` 原因
- `Test Design Handoff` 只写测试设计与文件建议，不写最终测试代码；最终 executable tests 由 review 阶段生成或更新

每个 `T*` 至少要有：

- 任务标题
- 来源点（`P*`）
- 涉及文件
- HOW（来自 subagent 研究结论）
- 验收标准
- 验证方式
- `Dependencies`（写 `none` 或依赖的上游 `T*`）

额外一致性要求：

- 每个 `T*` 的 `Validation` 必须与 feature-level `Required Harness` 相兼容
- 如果 `Required Harness = e2e`，则至少要能映射到某个 critical journey
- 如果 `Required Harness = unit`，则至少要能映射到某类 deterministic unit validation 或 coverage 目标
- 每个 `T*` 默认只服务一个主目标；如果同一任务需要多个主验证或跨多个关键文件族，继续拆分
- 每个 `T*` 的 `Dependencies` 必须显式写出 `none` 或依赖的上游 `T*`；不得把执行顺序留给 implement 阶段猜测
- 同一个 `P*` 生成的多个 `T*` 应在 `worklog.md` 的 `Task Checklist` 中保持连续，便于主 agent 在 T 级实现时审计来源点、判断顺序依赖并做 `P*` 聚合

如果某个 `P*` 还不够清晰：

- 不要强行生成可执行任务
- 把缺失内容写进 `plan.md` 的 `Pending User Input`
- 必要时继续用 `askquestion` 澄清
- 可选地写成 draft research only，但不能伪装成 ready task

### 步骤 7：整体连贯性分析（CRITICAL）

所有 `P*` 和 `Q*` 都已处理完毕后，在最终确认 `Task Checklist` 之前，必须执行一次整体连贯性分析。

参考 `prompts/coherence-check-prompt.md`，至少检查：

1. 任务串接检查
2. 遗漏检查
3. 冲突检查
4. 边界检查
5. 依赖检查
6. 验证策略检查

如果发现漏洞 / 断裂 / 遗漏：

- 把问题整理成具体的 `askquestion`，向用户确认补充方案
- 用户回答后，相应更新 `spec.md` / `plan.md` / `worklog.md`
- 如果需要重新探索某个 `P*`，回到步骤 5 对该 `P*` 重新执行闭环

### 步骤 8：确定 spec 状态并收尾

状态规则：

- 所有关键问题都已闭合，所有 `P*` 都已完成用户确认并形成可执行 `T*`，且 `Verification Strategy` 已绑定项目级回归基线 → `ready`
- 还存在未决 `Q*`、artifact 冲突、多个候选 feature folder、或某些 `P*` 仍缺用户输入 → `needs-user-input`

收尾输出只包含：

- requirement archive 路径
- spec 路径
- plan 路径
- worklog 路径
- project test 路径
- spec 状态
- 写入了多少个 `P*` / `Q*` / `T*`
- 还缺哪些用户输入（如有）

然后直接停止。

## 阶段自检（CRITICAL）

在把 `spec.md` 标记为 `ready` 之前，主代理必须逐项自检以下事实；任一项不满足都不得收尾为 ready：

1. 每个 `P*` 都有 subagent 研究结果
2. 每个 `P*` 都已经通过一次 `askquestion` 获得用户确认
3. 每个 `P*` 的 HOW 都经过主代理审查并写入 `plan.md`
4. 没有任何 `T*` 是在缺失上述任一条件时生成的
5. 所有 `Q*` 都已关闭，或 spec 状态明确为 `needs-user-input`
6. `spec.md`、`plan.md`、`worklog.md` 三者之间的引用关系一致
7. `Verification Strategy` 已引用 `.sdd-slim/_project/test.md`
8. 每个 `T*` 都已显式写出 `Dependencies`，且不存在缺失、悬空或循环依赖

如果自检发现 planning 过程中遗漏了 subagent / 用户确认 / coherence check：

- 不得继续假装完成
- 必须回到缺失步骤补做
- 必须在对应文档中修正，而不是只在对话里口头说明

如果自检发现某个 exploration 动作是主代理自己做的，而不是 subagent 做的：

- 该探索结果不得作为 ready 依据
- 必须重新用 subagent 补做对应探索
- 补做完成前，不得生成或保留依赖该探索结果的 `T*`

如果自检发现主代理在未获得用户明确确认的情况下开启了 multiAgent：

- 该并行探索结果不得直接作为 ready 依据
- 主代理必须补发确认问题；若用户不确认，则回退到串行模式重新完成必要探索
- 在确认状态被纠正前，不得把 spec 标为 `ready`

#### subagent 约束

- 只返回结构化摘要，不要贴原始搜索输出
- HOW 必须基于现有代码模式
- 不允许凭空设计与项目风格冲突的新架构
- 如果信息不足，不要硬编任务，必须明确写出 `Questions requiring user input`
- 即使在 multiAgent 模式下，每个 subagent 仍只负责一个 `P*` 或一个明确的问题研究包

prompt 模板见 `prompts/subagent-task-prompt.md`。
`Q*` 提问模板见 `prompts/clarification-question.md`。
`P*` 确认模板见 `prompts/point-confirmation-question.md`。

## 明确禁止

- 不得在收尾时询问“是否执行 sdd-slim-implement”
- 不得调用任何其他 skill
- 不得把 planning 阶段偷偷延长成 implementation
