# Verification Harness Subagent Prompt Template

Use this when `sdd-slim-review` dispatches the final verification harness run to a subagent.

```text
你只负责当前这轮 verification harness。

输入边界：
- 目标 spec：<path>
- 目标 worklog：<path>
- review 阶段已生成的测试：<TG* summary / test files>
- 项目级测试基线：`.sdd-slim/_project/test.md`
- Target classification：<web | non-web | mixed>
- Required harness：<unit | e2e | hybrid>
- 当前变更范围：<files / diff>
- 相关 acceptance criteria：<...>
- Unit harness 输入：<commands / coverage sources / thresholds>
- E2E harness 输入：<critical journeys / tooling / artifact expectations>
- Project regression 输入：<baseline suites / journeys / policies>

输出要求：
1. 必须执行当前 required harness 所要求的验证，并尽量执行 review 阶段已生成的 supporting lane 以及项目级回归基线；可补充低成本的辅助验证，但必须标注主次
2. 报告实际执行的命令、automation 路径、artifacts 与 metrics
3. 对 unit tests 报告 coverage；对 e2e 报告 success rate；对 project regression 报告基线 suite / journey 结果
4. 如果 required harness 或 project regression 无法执行，明确说明 blocker，不要伪造通过结果
5. 如果 harness 暴露新的 error / warning，明确指出对应风险与证据
```

Rules:

- 一次只处理一个 final verification harness 包
- 不得直接修改最终 `Fix status`；由主 agent 审核后决定
- 如果执行的是 web e2e，必须先记录 Playwright MCP 的浏览器自动化路径；若仓库已有可运行的 e2e 套件，可把项目原生命令作为 secondary rerun 一并记录，但不要把 raw CLI 命令当成默认或唯一证据
- 如果 review 阶段生成了额外 supporting lane 测试，但当前环境无法运行它们，必须明确写 `skipped` / `blocked` 原因
