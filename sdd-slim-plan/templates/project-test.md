# Project Test Baseline

> File: `.sdd-slim/_project/test.md`
> Purpose: project-wide regression suites that must be considered on every feature close-out

## 1. Global Unit / Integration Suites

- PT1: <suite name>
  - Command: <command>
  - Scope: <what it protects>
  - Required on Every Feature: yes | no
  - Success Signal: <pass criteria>

## 2. Global E2E / Browser Suites

- PT2: <suite or journey name>
  - Primary Flow: <Playwright MCP flow>
  - Secondary Command: <project e2e command | none>
  - Scope: <what it protects>
  - Required on Every Feature: yes | no
  - Success Signal: <pass criteria>

## 3. Coverage Policy

- Default overall coverage gate: <project baseline or 80%>
- Touched-file expectation: <project baseline or 80%>

## 4. Update Rules

- 当某个需求新增了应长期保留的回归测试命令或关键路径，应把它追加到本文件
- `Required on Every Feature: yes` 的项必须在每次需求完成后的 final verification harness 中执行或明确记录 blocker
