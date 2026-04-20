---
name: sdd-slim-submit
description: |
  Use when: 用户希望把当前代码改动按“日期 + 任务名”创建分支并完成本地提交。
  默认分支名格式为 `YYYY.MM.DD.<task-name>`；任务名优先来自用户输入，其次可来自当前 feature folder 名称、当前 `spec.md` 标题或文件名，仍不明确时再用 `askquestion` 澄清。
  如果当前项目存在 git submodule 且有 submodule 改动，则只在每个有改动的 submodule 中创建同名分支并提交子仓库改动，禁止提交主仓库。
user-invocable: true
---

# SDD Slim Submit

只做 branch + local commit。

## 路由

1. 读取 `submit.md`
2. 如果任务名不明确，优先从当前 feature folder / `spec.md`、当前用户请求或当前任务上下文提取；仍不明确时使用 `askquestion`
3. 先检查当前仓库与 submodule 的 git 状态，再决定普通模式或 `submodule-only` 模式

## 独立性规则

- 本 skill 只能由用户手动调用
- 默认动作是：创建分支 → 本地提交 → 输出结果
- 不自动 push
- 不自动创建 PR
- 不修改 `sdd-slim-plan` / `sdd-slim-implement` / `sdd-slim-review` 的任何规则
- 普通仓库或没有 submodule 改动时：在当前仓库提交
- 一旦检测到有 submodule 工作区改动：进入 `submodule-only` 模式，只处理有改动的 submodule
- `submodule-only` 模式下禁止提交主仓库，包括：
- 禁止提交 submodule 指针更新
- 禁止提交 `.gitmodules`
- 禁止在主仓库创建本地提交
- 如果没有可提交改动，不创建空提交
- 如果 branch 名称、任务名或目标仓库不明确，可以用 `askquestion` 做一次最小澄清
