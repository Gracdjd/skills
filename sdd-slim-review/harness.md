# SDD Slim Verification Harness

> 输入：目标 feature artifact set + 当前改动 + 项目级测试基线 + 可执行测试环境
> 输出：统一的验证结论 + 可回写的测试报告

## 目标

把 review 阶段里的“验证”收敛成一个真正的 harness：

- 先识别目标类型
- 再选择 required lane（`unit` 或 `e2e`）
- 运行项目原生测试命令或浏览器自动化
- 再执行 `.sdd-slim/_project/test.md` 中定义的项目级回归基线
- 记录 commands / artifacts / metrics
- 生成统一报告，回写到同一个 feature folder 的 `worklog.md`

## 核心定义

- harness：负责选择验证 lane、执行 graders、聚合结果、生成报告的统一执行层
- target classification：
  - `web`：存在 browser UI / 页面交互 / 用户旅程验收面
  - `non-web`：库、后端、CLI、脚本、服务层、纯数据处理
  - `mixed`：同时存在 web UI 与非 web 逻辑；如果本轮验收包含 browser UI，required lane 仍是 `e2e`
- required lane：
  - `e2e`：`web` 必选
  - `unit`：`non-web` 必选
  - `hybrid`：只在用户明确要求，或当前 spec 已明确要求两类验证都必须成为 release gate 时使用
- supporting lane：
  - spec 或 `plan.md` 的 `Test Design Handoff` 中声明、由 review 阶段生成的辅助测试 lane
  - supporting lane 不替代 required lane，但只要已生成且可运行，就应在 final harness 中一并执行
- project regression baseline：`.sdd-slim/_project/test.md` 中记录的每个需求收尾时都要重跑的全局 suite / journey / coverage policy

## 通用规则（CRITICAL）

- 优先复用项目内现有测试命令、覆盖率报告和 e2e 报告产物
- 不得把“主观点点看”或“口头说明应该没问题”当成 harness；必须有可执行命令或可复现的 browser automation 路径
- harness 关注 outcome，不强行约束唯一实现路径
- 结果必须 grounded：所有通过 / 失败结论都要能追溯到实际执行的命令、automation 路径、coverage 文件或 artifacts
- required lane 无法执行时，不得宣称验证完成；必须记录 `blocked` 或明确的验证缺口
- supporting lane 若已由 review 生成但无法执行，也不得静默跳过；必须记录 `skipped` / `blocked` 原因
- project regression baseline 无法执行时，也不得静默跳过；必须记录 `skipped` / `blocked` 原因
- 如果当前环境允许，尽量在稳定、干净、可重复的环境下执行；避免共享脏状态导致假阳性 / 假阴性
- 如果 harness 在 final run 中暴露新的 `error` / `warning`，必须回流到同一轮 `sdd-slim-review`，生成新的 `R*` 或把旧 finding 保持 `deferred`；不能忽略后继续收尾

## Unit Lane

适用：`non-web` 目标，或 `hybrid` 中的 unit 子集。

执行要求：

- 运行项目原生的 unit test command，并尽量开启 coverage
- 如果 unit 是 review 阶段生成的 supporting lane，也应尽量执行；除非明确 blocker
- 优先遵循项目已有脚本；例如：`npm test -- --coverage`、`pnpm test --coverage`、`pytest --cov`、`go test -coverprofile`、`cargo tarpaulin`
- 如果项目已有更严格 coverage baseline，遵从项目 baseline
- 如果项目没有明确 baseline，默认参考常见 harness 做法：`overall >= 80%`，并尽量让 touched files 达到 `80%`
- 至少覆盖：happy path、error path、null / empty / boundary、当前改动直接触达的 public behavior

报告必须包含：

- tests passed / total
- coverage source（stdout、json、xml、html、lcov 等）
- `lines / functions / branches / statements`
- 低于阈值的 touched files（如果可得）
- before / after coverage delta（如果能拿到 baseline）

## E2E Lane

适用：`web` 目标，或 `hybrid` 中的 e2e 子集。

执行要求：

- 先从 `spec.md` 的 `Acceptance Criteria`、`Verification Strategy`、changed paths 中提取 critical journeys
- web 验证必须是 browser automation；不接受纯口头手测
- Playwright MCP 是默认的 agent 侧浏览器执行入口；先启用浏览器交互工具组，按需补充表单/文件与页面捕获工具组
- 优先通过 Playwright MCP 覆盖 required journeys，再决定是否补跑项目内现有 E2E suite（Playwright、Cypress 等）
- 如果 e2e 是 review 阶段生成的 lane，优先保证这些 journeys 已被 Playwright MCP 覆盖；仓库内 Playwright 套件是长期回归资产，可作为 secondary rerun 一并汇总
- raw CLI / 项目命令只应作为 CI 或显式回归复跑的 secondary path，不应成为唯一或默认的 agent 侧验证证据
- 如果当前环境无法使用 Playwright MCP，且 spec / 项目基线也未显式允许 secondary path 单独兜底，则记为 blocker
- 每条 critical journey 至少要有明确目标：happy path、error path、regression path 之一
- 如果怀疑 flaky，可以对关键路径复跑 3 次并单独记录稳定性；否则至少完整跑 1 次

报告必须包含：

- journeys passed / total
- `success rate = passed journeys / total journeys * 100%`
- artifacts（screenshots、videos、traces、html reports、junit xml 等）
- flaky observations（如有）

## Project Regression Baseline

适用：所有需求收尾。

执行要求：

- 读取 `.sdd-slim/_project/test.md`
- 根据其中的 unit / integration suites、global e2e journeys、coverage policy，执行本需求收尾要求的项目级回归
- 如果当前需求只影响部分子系统，也要明确说明哪些基线被执行、哪些被跳过以及理由

报告必须包含：

- executed baseline suites / journeys
- skipped baseline suites / journeys 及原因
- blocked baseline suites / journeys 及原因
- 与 feature-level required lane 的关系说明

## 报告模式（CRITICAL）

harness 运行结束后，必须把结果汇总成统一的 `Verification Harness Report`，并回写到当前 feature folder 的 `worklog.md`。

报告至少包含：

- `Target classification`
- `Required harness`
- `Overall verdict`（`pass` | `fail` | `blocked`）
- `Commands run`
- `Unit Tests` 小节
- `E2E` 小节
- `Project Regression` 小节
- `Artifacts`
- `Blockers / residual risks`

统一要求：

- `Unit Tests` 小节始终存在；未执行时写 `Status: skipped | blocked`，并给出原因
- `E2E` 小节始终存在；未执行时写 `Status: skipped | blocked`，并给出原因
- `Project Regression` 小节始终存在；未执行时写 `Status: skipped | blocked`，并给出原因
- 不允许只写“已通过”而没有 coverage、success rate 或 baseline 执行结果

## 回写位置

- 优先回写当前 feature folder 的 `worklog.md`
- 默认写入 `worklog.md` 的 `Review Findings` 下的 `Verification Harness Report`
- `spec.md` 只在需要时同步高层状态或 residual follow-up
- 只有用户明确要求独立报告时，才额外输出单独文件
