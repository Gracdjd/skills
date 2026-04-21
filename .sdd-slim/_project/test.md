# Project Test Baseline

> File: `.sdd-slim/_project/test.md`
> Purpose: project-wide regression suites that must be considered on every feature close-out

## 1. Global Unit / Integration Suites

- PT1: workflow demo unit suite
  - Command: `cd workflow-demo-web && npm run test:unit`
  - Scope: protects review-board state transitions, handoff coverage math, and deterministic UI behavior
  - Required on Every Feature: yes
  - Success Signal: all Vitest suites pass and coverage remains reported

## 2. Global E2E / Browser Suites

- PT2: workflow demo browser journeys
  - Primary Flow: Playwright MCP journey set covering queueing, mark-generated, and filter-empty-state behavior
  - Secondary Command: `cd workflow-demo-web && npm run test:e2e`
  - Scope: protects queueing a review-owned test package, marking it generated, and filter empty-state behavior
  - Required on Every Feature: yes
  - Success Signal: Playwright MCP journeys pass; when secondary command is used, the repo Playwright suite also passes in Chromium

## 3. Coverage Policy

- Default overall coverage gate: lines 100%, functions 100%, branches >= 95%, statements 100%
- Touched-file expectation: touched TypeScript files should remain fully covered when practical; branch coverage should not regress below the current 95% demo baseline

## 4. Update Rules

- 当某个需求新增了应长期保留的回归测试命令或关键路径，应把它追加到本文件
- `Required on Every Feature: yes` 的项必须在每次需求完成后的 final verification harness 中执行或明确记录 blocker
