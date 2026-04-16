# SDD Slim Plan Learning — Specify

> 输入：参考项目代码库 / 当前项目 / 在线仓库 / 项目链接 / 需求描述 / “我想复刻一个类似 X 的项目”
> 中间产物：`.sdd-slim/<feature-name>.requirement.md`
> 输出：`.sdd-slim/<feature-name>.spec.md`

## 单文档策略

本流程继续维护一个 canonical `*.spec.md`，但它是 learning-oriented spec：

- 它同时承载模块图、知识点规划、学习顺序、任务清单
- implement、review、fix 仍优先回写这个 spec 文件
- 该 spec 的核心主轴是 `M*` / `K*` / `T*`，不是 `P*`

## HARD GATES

- 主代理必须直接根据当前输入启动 planning，不得先回复“请提供项目类型 / 请先选一种来源”之类的通用收集话术
- requirement archive 必须先落盘，再进行模块拆分与代码研究
- requirement archive 必须同时整理：参考项目事实、用户的复刻目标、可接受的范围裁剪、已知约束
- 如果输入里已经包含项目路径、仓库链接、截图文字说明、功能描述，主代理必须直接归档并继续 planning
- 若项目很大，也必须先给出全局模块图，然后再规划推荐学习顺序；不能直接只规划一个局部文件夹而声称“整个项目已拆分完毕”
- learning 版 planning 必须先按模块 `M*` 拆解整个项目，再为每个模块规划知识点 `K*` 与任务 `T*`
- 所有代码库探索都必须通过 subagent 完成，包括模块边界识别、入口定位、调用链核实、依赖分析、可复用模式识别、知识点提炼、验证路径建议
- 主代理在 plan 阶段只负责 requirement 归档、spec 写回、提问编排、审查 subagent 结果，不得亲自承担 repo exploration
- 每个 `M*` 的 subagent 结果必须至少覆盖：入口文件、关键运行流、复用模式、建议学习顺序、知识点、候选任务、验证方式、风险
- 每个 `M*` 在写入 spec 后，必须通过 `askquestion` 做一次模块确认；简单模块也不能跳过
- 任务生成必须偏向“每个 task 都能讲明白一个或几个知识点，并产出一个可见增量”
- 禁止生成“先把整个项目所有类型补完”“先把所有接口壳子搭完”这类对学习者过于干燥、且缺少即时反馈的横切任务序列，除非 spec 明确记录这是某个模块的前置且用户认可
- 每个 `T*` 都必须明确关联至少一个 `K*`，否则它不是 learning task
- 如果某个 `K*` 没有首次讲解任务，或首次讲解发生在它已被大量依赖之后，必须在 coherence 检查里修正
- 不写产品代码，不自动进入 implement / review / fix

## 流程

### 步骤 1：归档学习目标与参考项目

1. 解析当前用户输入，自动识别这些来源，而不是先问用户属于哪一种：
   - 当前 workspace 代码
   - 本地目录 / 文件
   - Git 仓库 / 在线项目链接
   - 截图 / 页面描述 / 用户补充文本
   - 复刻目标与学习重点
2. 生成 provisional kebab-case 的 `<feature-name>`
3. 把 requirement archive 写到 `.sdd-slim/<feature-name>.requirement.md`
4. requirement archive 必须至少包含：
   - Reference project / sources
   - Desired replica scope
   - What to keep consistent
   - What can be simplified
   - Known constraints
   - Requirement availability: `available | partial | missing`
   - Missing information and blockers
5. 如果 `Requirement availability` 是 `partial` 或 `missing`：
   - 仅允许先创建 spec 骨架
   - 只写 `Q*` 与 `Pending User Input`
   - 立即通过 `askquestion` 发出第一个阻塞问题
   - 不得进入模块拆分或任务生成

### 步骤 2：创建 learning spec

1. 默认路径：`.sdd-slim/<feature-name>.spec.md`
2. 使用 `templates/learning-spec.md` 创建骨架
3. 如果已有多个相关 spec 且用户未指定，使用 `askquestion` 让用户选择目标 spec

### 步骤 3：先做全局模块图，而不是直接任务化

必须先把整个项目拆成 `M1`、`M2`、`M3`... 模块，并写入 `Project Module Map`。

每个 `M*` 至少要定义：

- 模块标题
- 该模块在整个项目中的职责
- 为什么这个模块适合在当前阶段学习
- 推荐学习顺序位置
- 与前置模块的依赖
- 该模块预期会覆盖的知识点 `K*`

模块拆分要求：

- 尽量让每个模块都形成“可见结果 + 关键知识点 + 最小闭环”
- 模块之间要能串成完整复刻路线
- 允许有基础模块，但不能把整个计划退化成“先学所有基础设施，再碰业务”

### 步骤 4：先逐个关闭 `Q*`

任何阻塞模块划分、知识点归属、复刻边界的问题，都要先写成 `Q*` 并通过 `askquestion` 单独关闭。

### 步骤 5：对每个模块执行“subagent 研究 → 审查 → 模块确认 → 任务化”闭环

对每个 `M*` 串行执行以下闭环：

1. 使用 `prompts/module-subagent-task-prompt.md` 调用 subagent，对当前模块做代码研究
2. subagent 返回后，主代理必须先审查其结果是否 grounded、是否真的反映现有项目模式、是否适合作为教学路径
3. 如果结果不够具体、不够可教、或过于横切，必须重新派发同一模块，补充缺口说明
4. 结果合格后，写入 `Module Research Findings`
5. 然后使用 `askquestion` 做一次模块确认，提问内容必须包含：
   - 当前模块的职责
   - 为什么先学 / 此时学
   - 计划覆盖的知识点
   - 候选任务顺序
   - 推荐验证方式
6. 用户确认后，才允许为当前模块生成 `T*`

### 步骤 6：任务化规则

learning 版的 `T*` 生成规则：

- 实现粒度以“单次开发会话内可以完成并讲清楚”为准
- 每个 `T*` 必须同时描述：
  - 对应模块 `M*`
  - 对应知识点 `K*`
  - 这一 task 的学习目标
  - 涉及文件
  - 预期产出
  - HOW
  - 解释重点
  - 注释要求
  - 验收标准
  - 验证方式
- 尽量让一个 `T*` 本身就能看到可见增量，例如一个小功能、一段完整数据流、一个真实可运行的页面区块、一个能打通的交互闭环
- 若某个任务只是抽象准备工作，必须说明它服务于哪个紧随其后的可见结果；如果说不清，就说明任务拆分过于枯燥，应重新拆分

### 步骤 7：知识点连贯性检查

在标记 spec 为 `ready` 前，必须额外完成一次 learning coherence 检查：

1. 整个项目是否已被模块图覆盖
2. 每个模块是否都有明确学习目标
3. 每个知识点 `K*` 是否有首次讲解位置
4. 每个知识点是否由至少一个 `T*` 承接
5. 任务顺序是否尽量遵循“先看到结果，再补抽象；边做边讲，而不是纯铺底”
6. 是否出现过度横切、过度基础设施化、过度重复的任务设计

如果发现问题：

- 必须调整模块顺序、知识点归属或任务拆分
- 如需用户取舍，转成 `Q*` 用 `askquestion` 关闭

### 步骤 8：确定状态并收尾

- 所有 `Q*` 已关闭，所有 `M*` 已完成 subagent 研究与用户确认，所有 `K*` 已被任务覆盖，任务顺序具备 learning coherence：`ready`
- 仍存在未决 `Q*`、模块边界不稳定、关键知识点尚未落到任务上：`needs-user-input`

收尾输出只包含：

- requirement archive 路径
- spec 路径
- spec 状态
- 写入了多少个 `M*` / `K*` / `Q*` / `T*`
- 还缺哪些用户输入

然后直接停止。
