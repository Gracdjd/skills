# SDD Slim Review — Review Only

> 输入：实现后的代码 + 相关 canonical `*.spec.md`（如有）
> 输出：review findings only

## 单文档策略（CRITICAL）

- 优先把 review 结论写入当前 canonical spec 的 `Review Findings`
- 默认不创建单独的 review report
- 只有当用户明确要求额外报告时，才额外输出独立文件

## HARD GATES

- 只能由用户显式触发 `sdd-slim-review`
- review 顺序必须是：spec 合规 → bug / 质量 / 回归风险
- 不修改产品代码
- 不自动修复任何问题
- 如果目标 spec / review 范围不明确，可以用 `askquestion` 做必要澄清
- review 结束后直接停止，不得触发 `sdd-slim-fix`
- 不得自动进入任何其他 skill
- 每条 actionable finding 必须有稳定的 `R*` 编号，方便后续 `sdd-slim-fix` 逐条消化

## 前置检查

### 1. 选择 review 目标

- 如果存在一个明确相关的 canonical spec，优先基于该 spec review
- 如果存在多个候选 spec 且用户未指定：
  - 使用 `askquestion` 让用户选择
- 如果没有 spec，也可以做临时 review，但必须明确说明“本次 review 无 spec 约束，只按当前代码与用户要求检查”

### 2. 读取最小必要上下文

优先读取：

- 用户要求
- 相关 `*.spec.md`
- changed files / diff
- `lsp_diagnostics`
- failing tests / build output

## 两阶段审查

### 阶段 A：Spec 合规审查（先做）

逐项检查：

- 代码是否覆盖了 spec 的 in-scope 内容
- 验收标准是否都有对应实现或验证
- 是否有 spec 未要求的过度实现
- task checklist 中承诺修改的关键文件是否真的被触达

### 阶段 B：代码质量 / bug 审查（后做）

重点检查：

- 明显逻辑错误
- 空值 / 边界条件缺失
- 回归风险
- 诊断 / 测试 / 构建失败
- 明确会造成维护风险的问题

## Findings 处理规则

所有发现只做记录，不做修复。

严重度：

| 严重度 | 含义 | 默认是否进入 fix 目标 |
| --- | --- | --- |
| error | 明确 bug / requirement mismatch / failing check | 是 |
| warning | 有现实风险、值得修复的问题 | 是 |
| info | 建议 / 观察 / 轻微偏差 | 否 |

每条 finding 至少包含：

- ID
- Severity
- Summary
- Evidence
- Affected files
- Suggested repair direction
- Suggested validation
- Fix status

`Fix status` 只允许：

- `open`
- `fixed`
- `deferred`

## 回写规则

把 review 结果写入当前 spec 的 `Review Findings`，至少包含：

- Review 范围
- Findings 列表
- Actionable findings（供 fix 消费）
- 已运行的验证
- 仍需用户决定的 blocker（如有）

状态建议：

- 无 actionable finding → `reviewed-clean`
- 有 `error` / 需要修复的 `warning` → `fix-needed`
- 只有 info 级别 → `reviewed`

## Completion Output

只报告关键结果：

- issues found
- actionable findings
- severities
- validations run
- blockers (if any)

然后停止。
