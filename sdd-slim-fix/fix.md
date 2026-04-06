# SDD Slim Fix — Resolve Review Findings

> 输入：相关 canonical `*.spec.md` 中的 `Review Findings`，或在没有 findings 时由用户指定的问题
> 输出：最小修复 + 验证 + 更新后的 `Fix Notes` / `Review Findings`

## 单文档策略（CRITICAL）

- 如果存在相关 canonical `*.spec.md`，优先把修复记录写回同一个文件的 `Fix Notes`
- 同时更新 `Review Findings` 中对应 `R*` 的 `Fix status`
- 默认不额外创建 `tasks.md` / `progress.md`

## HARD GATES

- 默认目标是：当前 spec 的 `Review Findings` 中所有 `Fix status: open` 且 severity 为 `error` / `warning` 的 findings
- 如果 review 没有暴露任何 actionable findings，必须用 `askquestion` 让用户指定本轮要修哪个问题
- 如果有多个候选 `*.spec.md` 且用户未指定，使用 `askquestion` 让用户选择
- 如果目标问题、成功标准或预期行为不清楚，可以用 `askquestion` 做必要澄清
- 只做最小修复；禁止顺手重构、清理无关代码或扩大范围
- 没有具体验证，不得宣称修复完成
- 不得自动进入其他 skill

## 流程

### 步骤 1：确定本轮 fix 目标集

1. 优先读取选定 spec 的 `Review Findings`
2. 收集所有满足以下条件的 findings：
   - `Severity: error | warning`
   - `Fix status: open`
3. 如果找到了这些 findings：
   - 本轮 fix 目标就是**全部**这些 findings
4. 如果没有找到任何 actionable finding：
   - 使用 `askquestion` 询问用户本轮具体要修哪个问题

### 步骤 2：逐条定位根因

对每个目标 `R*`：

- 读取其 Evidence / Affected files / Suggested repair direction
- 结合当前代码确认根因
- 如果仍存在行为歧义，用 `askquestion` 只问当前 `R*`

### 步骤 3：按顺序逐条修复

修复原则：

- 优先修根因，不修表象
- 优先沿用现有模式
- 只改与当前 findings 直接相关的代码
- 一个 finding 修完并验证后，再进入下一个 finding

### 步骤 4：逐条验证

每修完一个 `R*`，至少做一个直接相关的验证：

- review 中建议的 validation
- 定向测试
- `lsp_diagnostics`
- typecheck / lint / build（按影响范围选择）

### 步骤 5：回写与收尾

如果存在相关 spec，把 fix note 写到 `Fix Notes`，至少包含：

- Resolved findings
- Root cause summary
- Files changed
- Validations run
- Remaining findings / risks

同时更新 `Review Findings`：

- 修复成功的 `R*` → `Fix status: fixed`
- 暂时无法安全关闭的 `R*` → `Fix status: deferred`

## Completion Output

只报告关键结果：

- target findings
- resolved findings
- deferred findings / blockers
- files changed
- validations run
