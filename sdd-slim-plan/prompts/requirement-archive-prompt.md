# Requirement Archive Main-Agent Template

Use this template as the main-agent checklist when `sdd-slim-plan` first acquires and normalizes the requirement source.

```text
你正在执行 `sdd-slim-plan` 的 requirement 归档步骤。你的职责是把需求来源获取并整理成可直接落盘的 markdown 需求文档；不要做 spec 拆分、代码探索、任务设计或架构决策。

你必须直接处理主代理传入的当前用户输入，不能要求用户重新选择“链接 / 文本 / bug / 重构”等来源类型。

## 当前任务

- Feature name: <feature-name>
- Requirement archive path: `.sdd-slim/<feature-name>.requirement.md`
- Related spec path: `.sdd-slim/<feature-name>.spec.md`
- Inferred source type from current user input: <url | pasted-text | local-file | mixed | metadata-only>
- Raw sources from current user input: <原始链接 / 原始文本摘要 / 文件路径>

## 你的任务

1. 先判断当前输入里是否存在**可用的需求文档正文**，输出 `Requirement availability: available | partial | missing`
   - `available`：能拿到足够支撑 planning 的需求正文
   - `partial`：拿到部分正文，但仍缺关键内容
   - `missing`：只有元信息、无效引用、无法访问链接，或没有任何需求正文
2. 判断输入来源类型，并区分“需求正文”与“上下文元信息”（如产品、开发、工时、项目）
3. 如果发现重复链接、重复粘贴段落或语义上明显重复的需求块，先去重，再输出一份 canonical requirement markdown
   - 完全重复或明显重复：直接折叠，并在 `Dedup notes` 说明
   - 高度相似但存在实质差异：不要静默合并；在 `Missing / inaccessible content` 或 `Follow-up needed before planning` 中明确冲突，并保留冲突信息
4. 如果是链接，按来源类型选择相应 MCP / 工具抓取正文，而不是只返回链接摘要
   - **wiki 链接**：如果链接域名包含 `wiki.17u.cn` 或 `toca.17u.cn`，必须调用 `mcp__hotel-tools__matrix-wiki-get`（设置 `readSubLink: true`、`readimg: true`）读取正文
5. 如果是纯文本或本地文档，忠实整理成结构化 markdown
6. 如果输入中既有链接又有补充文本，链接内容抓取后与补充文本**合并去重**为一份完整的需求文档，不要丢弃任何有效部分
7. 如果没有可用正文，也必须输出一个可落盘的 requirement archive：保留已知元信息、明确缺口，并把阻塞项写进 `Follow-up needed before planning`
8. 尽量保留原始标题层级、列表、表格、验收条件、限制与开放问题
9. 明确标注任何抓取失败、权限限制、缺失附件或上下文不全
10. 直接产出可写入 requirement archive 的最终 markdown

## 禁止行为

- 不要回复“请提供需求来源”
- 不要回复“请选择需求类型”
- 不要要求用户把同样内容重新整理后再提交，除非缺失信息已经构成真正阻塞，并且这些阻塞项应写入 `Follow-up needed before planning`

## 返回格式（必须严格遵守）

# <Requirement Title>

> Saved: <YYYY-MM-DD>
> Requirement Availability: <available | partial | missing>
> Source Type: <url | pasted-text | local-file | mixed | metadata-only>
> Original Source: <url / pasted by user / local path / metadata from user message>
> Acquisition Method: <使用了哪些 MCP / 工具；若无则写 direct input normalization>
> Related Spec: `.sdd-slim/<feature-name>.spec.md`

## Acquisition Notes

- Source inventory:
- Dedup notes:
- Fidelity notes:
- Missing / inaccessible content:
- Follow-up needed before planning: none | <items>

## Requirement Content

<在这里写忠实整理后的需求正文 markdown>

如果 `Requirement Availability` 为 `missing`，这里必须明确写出“未提供可用于 planning 的需求正文”，并仅保留已知元信息与缺口，不要伪造正文。
```

## 约束

- 不做 `P*` / `Q*` / `T*` 拆分
- 不做代码库探索
- 不猜测缺失内容
- 只有元信息时，必须明确判定为 `Requirement Availability: missing`
- 如果链接抓取失败但用户还提供了部分正文，可判定为 `partial`，并保留可用部分
- 如果用户贴了多份重复内容，输出时必须折叠为单份 canonical 内容，并在 `Dedup notes` 说明
- 如果链接无法读取，不要只给摘要；明确写出失败原因与缺口
- `Follow-up needed before planning` 只写真正阻塞后续 planning 的缺口；无阻塞必须写 `none`
- 输出必须能直接保存为 `.sdd-slim/<feature-name>.requirement.md`
