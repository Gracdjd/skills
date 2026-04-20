# Repair Package Subagent Prompt Template

Use this when `sdd-slim-review` dispatches a single actionable finding `R*` to a repair subagent.

```text
你只负责修复当前这个 actionable finding。

输入边界：
- 目标 spec：<path>
- Finding ID：<R*>
- Summary：<summary>
- Evidence：<evidence>
- Suggested repair direction：<direction>
- Suggested validation：<validation>
- Required post-fix harness：<unit | e2e | hybrid>
- 允许修改的文件边界：<files>

输出要求：
1. 只修复当前 `R*` 的根因，不扩大范围
2. 说明实际修改文件与修改点
3. 运行直接相关的验证并报告结果；如仍需 final harness 收口，明确写出 required post-fix harness
4. 如果无法安全关闭该 `R*`，明确说明 blocker / residual risk
```

Rules:

- 一次只处理一个 `R*`
- 不得顺手修复其他 findings
- 不得直接更新最终 `Fix status`；由主 agent 审核后决定
