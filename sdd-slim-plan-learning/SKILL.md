---
name: sdd-slim-plan-learning
description: |
  Use when: 用户希望先系统学习一个现有项目，再按教学节奏复刻一个类似项目。
  该 skill 会先归档参考项目与复刻目标，再在 `.sdd-slim/<YYYY.MM.DD>.<feature-name>/` 下生成 learning 版 `requirement.md`、`spec.md`、`plan.md`、`worklog.md`；同时确保项目级 `.sdd-slim/_project/test.md` 存在。重点是先把整个项目拆成多个可学习模块，为每个模块规划知识点、学习顺序与 task，而不是按纯技术层横切实现。
  plan 阶段所有代码库研究仍必须交给 subagent；每个模块都要提前规划“学什么、为什么现在学、通过哪些 task 学会”。
  后续实现应由 `sdd-slim-implement-learning` 手动触发；learning 版 implement 按 T* 顺序教学式实现，并禁止使用 subagent。
user-invocable: true
---

# SDD Slim Plan Learning

只做 learning-oriented planning / specify。

## 路由

1. 读取 `specify.md`
2. 使用 `templates/learning-spec.md`、`templates/learning-plan.md`、`templates/learning-worklog.md` 作为 canonical learning artifact 模板
3. 如果 `.sdd-slim/_project/test.md` 不存在，使用 `../sdd-slim-plan/templates/project-test.md` 创建项目级测试基线文件
4. 模块级代码研究 subagent prompt 参考 `prompts/module-subagent-task-prompt.md`
5. 模块确认提问参考 `prompts/module-confirmation-question.md`
6. 示例见 `examples/example.spec.md`、`examples/example.plan.md`、`examples/example.worklog.md`

## 独立性规则

- 本 skill 只负责生成 / 更新 feature folder 下的 `requirement.md`、`spec.md`、`plan.md`、`worklog.md`，以及项目级 `.sdd-slim/_project/test.md`
- 不写任何产品代码
- 输入可以是当前项目、本地代码目录、Git 仓库、在线项目链接、截图说明，或“我想复刻一个类似 X 的项目”的描述；主代理必须先直接整理这些输入，而不是先反问来源类型
- requirement archive 必须记录两类信息：参考项目事实、以及用户想复刻到什么程度的目标边界
- plan 必须先产出全局模块图，再产出 task；不能直接跳到零散任务
- learning 版拆分的基本单位是 `M*` 模块、`K*` 知识点、`T*` 任务；仍允许有 `Q*` 澄清点，但不再以 `P*` 作为实现主轴
- 模块拆分必须倾向于“可学习的纵向切片”，而不是“先把所有类型定义做完，再做所有 API，再做所有界面”这种横切顺序
- 每个模块都必须提前规划：学习目标、进入该模块前应掌握什么、该模块会讲解哪些知识点、通过哪些 task 把知识点串起来
- plan 阶段所有与代码库有关的探索都必须使用 subagent；主代理不得自己直接承担 repo exploration
- 每个 `M*` 在研究完成后都必须通过 `askquestion` 做一次模块确认，确认模块边界、学习目标、知识点与任务顺序
- 只有当某个 `M*` 已完成 subagent 研究并完成用户确认后，才允许为该模块生成 `T*`
- 如果某个知识点 `K*` 没有被任何 `T*` 承接，则 planning 不完整，不得标记为 `ready`
- learning feature 也必须放进 `.sdd-slim/<YYYY.MM.DD>.<feature-name>/`，避免与标准版或其他学习需求产物混在一起
- planning 阶段必须确保 `.sdd-slim/_project/test.md` 存在，供后续每个学习需求在 final verification harness 中复用项目级回归基线
- 收尾时不主动进入 implement / review

## Learning Plan 的核心差异

- 目标不是“最快拆成可开发任务”，而是“把项目拆成可学习、可复刻、可讲解的渐进路线”
- 先覆盖整个项目有哪些模块，再决定先学哪个模块
- 每个模块都要尽量把相关知识点与实际结果放在同一段学习路径里，避免先做一堆抽象准备工作而没有可见结果
- 任务设计必须服务于“边做边学”：每个 `T*` 都要说明它会讲什么、产出什么、验证什么