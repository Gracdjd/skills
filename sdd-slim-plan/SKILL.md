---
name: sdd-slim-plan
description: |
  Use when: 用户希望先把需求文档/需求文本整理成单文档 canonical spec。
  该 skill 会先由主代理直接获取 / 归一化需求，并保存到 `.sdd-slim/<feature-name>.requirement.md`，再生成或更新 `.sdd-slim/<feature>.spec.md`；不写代码，不自动推进到其他 skill。
  主代理必须直接分析当前用户输入；如果消息里已有链接就直接抓取，如果没有链接但有需求文本就直接归档，不能先让用户再选择输入类型。
  requirement 归档阶段首先要判断当前输入里是否存在可用的需求文档正文，并去重重复来源 / 重复粘贴内容。
  对每个任务点的代码库探索与 HOW 生成，必须交给 subagent 完成；每个 `P*` 在代码研究完成后都必须通过 `askquestion` 向用户确认一次，即使是简单、看似明确的 `P*` 也不能跳过；若仍有额外阻塞项，再继续逐个 `askquestion` 关闭。
  每个 `P*` 必须顺序处理（一个接一个），不得并发调用多个 subagent。
user-invocable: true
---

# SDD Slim Plan

只做 planning / specify。

## 路由

1. 读取 `specify.md`
2. 主代理按 `prompts/requirement-archive-prompt.md` 直接完成需求获取 / 归档（如需抓取外部链接正文，直接调用对应 MCP / 工具；wiki 链接使用 `mcp__tc-wiki__matrix-wiki-get`）
3. 使用 `templates/spec.md` 作为 canonical spec 模板
4. 对单个 `Q*` 的澄清提问参考 `prompts/clarification-question.md`
5. 对每个 `P*` 的用户确认提问参考 `prompts/point-confirmation-question.md`
6. 对每个 `P*` 使用 `prompts/subagent-task-prompt.md` 驱动代码研究 subagent
7. 输出待补充信息时参考 `prompts/pending-input-output.md`
8. 输出任务研究摘要时参考 `prompts/research-summary-output.md`
9. 示例见 `examples/example.spec.md`
10. 所有 P*/Q* 处理完成后的整体连贯性分析参考 `prompts/coherence-check-prompt.md`

## 独立性规则

- 本 skill 只负责生成 / 更新 planning 文档（`.sdd-slim/<feature-name>.requirement.md` + `.sdd-slim/<feature-name>.spec.md`）
- 不写任何产品代码
- 不得先输出“请提供需求来源 / 请选择需求类型 / 您希望规划哪个功能”之类的通用收集问题
- 需求获取必须先由主代理直接完成，并先落盘到 `.sdd-slim/<feature-name>.requirement.md`
- 如果当前消息里已有链接，直接抓取；如果没有链接但有需求描述，直接归档并继续 planning
- requirement 归档阶段必须先判定需求正文是否存在（`available | partial | missing`）；只有元信息不算完整需求
- requirement 内容一旦整理完成，主代理必须立即写入 requirement archive；不得在落盘前插入无关等待、额外探索或长时间停顿
- 如果用户输入里有重复链接、重复粘贴段落或“链接 + 同内容补充”，必须先去重再归档
- 如果存在阻塞 planning 的 follow-up，主代理必须在写完 spec 后立即通过 `askquestion` 发出第一个阻塞问题，然后停止等待用户回答
- requirement 归档由主代理直接执行；如需抓取链接或本地文档正文，由主代理直接调用对应 MCP / 工具
- 每个 `P*` 在代码研究完成后都必须通过 `askquestion` 做一次用户确认，不得因需求简单或看似明确而跳过
- 额外的 `Q*` 也必须通过 `askquestion` 一次只问一个问题
- 完成后不主动询问是否进入 `sdd-slim-implement`
- 不触发 `sdd-slim-review`
- 不触发 `sdd-slim-fix`
- 其他 skill 只能由用户手动调用

## 顺序处理规则（CRITICAL）

- 每个 `P*` 必须**逐个顺序处理**，严禁并发调用多个 subagent
- 处理顺序：`subagent 探索 P*` → `确认 HOW 正确性` → `写入 spec` → `askquestion 确认当前 P*` → `如仍有额外阻塞再 askquestion` → `处理下一个 P*`
- subagent 负责探索代码库并给出 grounded 的 HOW 建议；主代理在 subagent 返回后，先判断 HOW 是否正确，再决定是否写入 spec
- 如果 HOW 不正确或不充分，主代理必须重新调用 subagent 对该 P* 再次探索，直到 HOW 足够正确
- 在所有 `P*` 和 `Q*` 都处理完成后，必须执行一次**整体连贯性分析**，检查所有任务是否能串起来、是否有漏洞
- 如果连贯性分析发现漏洞，必须通过 `askquestion` 向用户确认补充方案
