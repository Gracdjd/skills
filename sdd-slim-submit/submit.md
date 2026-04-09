# SDD Slim Submit — Branch and Commit Changes

> 输入：当前工作区中的 git 改动 + 一个任务名（来自用户输入、当前 spec 或一次必要澄清）
> 输出：以下二者之一
> 1. 当前唯一阻塞问题
> 2. 已创建的 branch + local commit 结果

## 目标

把当前改动整理成可提交状态。

默认动作只有两步：

- 创建分支
- 本地提交

默认不 push，不创建 PR。

## Branch Naming（CRITICAL）

- 分支名格式固定为 `YYYY.MM.DD.<task-name>`
- 日期默认使用当前本地日期
- `task-name` 优先来源：
- 用户明确给出的任务名
- 当前 `.sdd-slim/*.spec.md` 的文件名或标题
- 当前轮用户要求中可以直接提取的任务短名
- 仍不明确时，用 `askquestion` 只问一次
- 任务名保留用户原语言，不要擅自翻译
- 只做最小清洗以满足 git ref 规则：
- 去掉首尾空白
- 连续空白替换为 `-`
- 将 `/`、`\\`、`:`、`?`、`*`、`[`、`]`、连续 `..` 等非法片段替换或移除
- 如果清洗后任务名为空，必须 `askquestion`

## Commit Message（默认）

- 默认 commit subject 与 branch 名相同，即 `YYYY.MM.DD.<task-name>`
- 如果用户显式给了 commit message，优先使用用户版本
- 不提交明显像 secrets 的文件，例如 `.env`、凭证文件、私钥等

## HARD GATES

- 开始前必须先检查当前 repo 状态
- 没有改动时，不创建分支、不创建空提交
- 只提交当前目标 repo / submodule 中实际相关的改动
- 不得回退、覆盖或清理用户现有改动
- 遇到 branch 名冲突、目标仓库不明确或 checkout 不安全时，使用 `askquestion` 做最小澄清

## 模式判定

### 模式 A：普通模式

满足以下条件时使用：

- 当前仓库没有任何 dirty submodule

执行要求：

1. 在当前仓库创建或切换到目标 branch
2. 只在当前仓库 stage 相关改动
3. 创建本地 commit
4. 输出 branch 名、commit hash、变更文件、未处理项

### 模式 B：`submodule-only` 模式（CRITICAL）

满足以下任一条件时使用：

- 存在一个或多个 dirty submodule

执行要求：

1. 识别所有有改动的 submodule
2. 对每个有改动的 submodule，分别执行：
3. 在该 submodule 内创建或切换到同名 branch：`YYYY.MM.DD.<task-name>`
4. 只 stage 该 submodule 内部的相关改动
5. 在该 submodule 内创建本地 commit
6. 记录该 submodule 的 branch 名和 commit hash
7. 所有 submodule 处理完后直接停止

## `submodule-only` 额外约束（CRITICAL）

- 绝不在主仓库创建 commit
- 绝不提交主仓库中的 submodule 指针更新
- 绝不提交主仓库中的 `.gitmodules`
- 即使主仓库因为子仓库 commit 而出现 gitlink 变化，也只保留为未提交状态
- 如果主仓库还存在其他非 submodule 文件改动，也保持未提交，并在收尾时明确报告
- 没有改动的 submodule 直接跳过

## Branch Reuse 规则

- 如果目标 branch 已经是当前 repo / submodule 的当前分支，直接复用
- 如果目标 branch 已存在但不是当前分支，且安全切换，则切换后继续
- 如果切换会覆盖现有改动、或 branch 指向导致目标不明确，使用 `askquestion`

## 流程

### 步骤 1：解析任务名

1. 优先使用用户明确提供的任务名
2. 其次尝试从当前 spec 或当前任务上下文提取
3. 仍然不明确时，用 `askquestion` 只问一次

### 步骤 2：检查 git 状态

至少确认：

- 当前仓库是否有改动
- 是否存在 submodule
- 哪些 submodule 有改动
- 主仓库是否只有 gitlink 变化，还是还有其他文件改动

### 步骤 3：构造 branch / commit 名

- 用当前本地日期 + 任务名生成 `YYYY.MM.DD.<task-name>`
- 默认 commit subject 也使用同一字符串

### 步骤 4：按模式执行提交

- 普通模式：只在当前仓库提交
- `submodule-only` 模式：只在每个 dirty submodule 内提交，主仓库不提交

### 步骤 5：验证

至少确认以下结果：

- 目标 branch 已存在并处于预期 repo / submodule
- commit 已创建成功
- 主仓库在 `submodule-only` 模式下没有新增本地提交

## Completion Output

至少输出：

- mode：`normal` 或 `submodule-only`
- task name
- branch name
- 对于普通模式：当前仓库 commit hash
- 对于 `submodule-only` 模式：每个已提交 submodule 的路径、branch、commit hash
- skipped repositories / submodules
- 主仓库是否仍有未提交改动

## 明确禁止

- 不自动 push 任意仓库
- 不自动创建 PR
- 不提交空改动
- 不因为存在 submodule 就顺手提交主仓库
- 不把主仓库的 gitlink 更新当作本轮必须提交内容
