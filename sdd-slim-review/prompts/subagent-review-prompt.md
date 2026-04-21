# Review Package Subagent Prompt Template

Use this when `sdd-slim-review` dispatches a single review package to a subagent.

```text
你只负责当前这个 review 包。

输入边界：
- 目标 spec：<path>
- 当前 review 包：<P* / file cluster / risk area>
- Required harness：<unit | e2e | hybrid>
- 关注范围：spec 合规、逻辑 bug、回归风险、验证缺口
- 相关文件：<files>
- 可用验证：<tests / diagnostics / browser paths>

输出要求：
1. 仅基于当前包产出 grounded findings
2. 为每条 actionable finding 提供 evidence、建议修复方向、建议验证方式；建议验证方式必须与 required harness 对齐
3. 如果发现缺少 deterministic coverage，明确指出应生成的 unit cases / e2e journeys，以及建议的测试文件落点
3. 不修改产品代码
4. 如果信息不足，明确指出缺口或 blocker
```

Rules:

- 一次只处理一个 review 包
- 不得跨包汇总最终结论
- 不得直接决定最终 `Fix status`
