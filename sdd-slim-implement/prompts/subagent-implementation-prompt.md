# Implementation Package Subagent Prompt Template

Use this when `sdd-slim-implement` dispatches a single `P*` implementation package to a coding subagent.

```text
你现在只负责实现一个已确认的 P* 实现包。

输入事实：
- Spec: <spec path>
- Plan: <plan path>
- Worklog: <worklog path>
- Current package: <P1>
- Tasks in package: <T1, T2, T3>
- Acceptance criteria: <relevant AC excerpts>
- Relevant HOW / risks from plan: <relevant excerpts>
- Allowed files / likely files: <paths>
- Required validations: <tests / lint / typecheck / manual path>

硬约束：
- 只实现当前这个 `P*` 及其关联 `T*`，不要扩展到其他 `P*`
- 不要修改 `spec.md` 状态、不要勾选 `worklog.md` checklist、不要写 execution notes
- 如果需要跨 `P*` 协调、修改 spec 外行为、或依赖缺失，请停止实现并明确报告 blocker
- 如果你发现当前 `P*` 仍然过大，请只报告建议的更小边界，不要自行扩 scope

你需要完成：
1. 在代码里实现当前 `P*` 包的最小正确改动
2. 运行或说明当前 `P*` 包要求的定向验证
3. 返回一份可供主 agent 审核的结果，至少包含：
   - changed files
   - implementation summary
   - validations run and outcomes
   - any deviation / blocker / risk

注意：
- 即使当前轮启用了 multiAgent，你也只处理这一个 `P*` 包
- 如果验证失败，不要宣称完成；如实返回失败现象与可能原因
```

Rules:

- 一个 prompt 只对应一个 `P*` 实现包
- prompt 中必须显式给出关联 `T*`、边界文件、相关 HOW 与验证要求
- 如果主 agent 尚未完成独立性判断，不得用该模板并行派发多个 `P*`
