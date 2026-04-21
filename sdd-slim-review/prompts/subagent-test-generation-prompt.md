# Test Generation Subagent Prompt Template

Use this when `sdd-slim-review` dispatches a single `TG*` test-generation package to a subagent.

```text
你只负责当前这个 review 阶段的测试生成包。

输入边界：
- 目标 spec：<path>
- 目标 plan：<path>
- 当前测试包：<TG*>
- Target classification：<web | non-web | mixed>
- Required harness：<unit | e2e | hybrid>
- Supporting lanes：<unit | e2e | none>
- Source handoff：<unit cases / e2e journeys / suggested test files>
- 允许修改的文件边界：<test files only>
- 相关实现文件：<product files>

输出要求：
1. 只生成或更新当前 `TG*` 对应的测试文件，不修改产品代码
2. 明确写出覆盖了哪些 unit cases / journeys，哪些仍未覆盖
3. 运行至少一个与当前 `TG*` 直接相关的定向验证，并报告结果
4. 如果无法安全生成该测试，明确说明 blocker / missing dependency / selector gap
5. 如果当前包是 web e2e，优先生成仓库内的 Playwright 测试文件作为长期回归资产；Playwright MCP 浏览器执行路径本身不直接落成测试文件
```

Rules:

- 一次只处理一个 `TG*`
- 不得顺手修改产品代码
- 对 web e2e，不得生成只对当前 agent 有效的临时脚本；优先输出仓库可长期保留的 Playwright 测试文件
- 不得跨多个 lane 汇总最终测试结论
