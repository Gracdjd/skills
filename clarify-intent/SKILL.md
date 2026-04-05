---
name: clarify-intent
description: Clarify ambiguous user intent and deepen initial task analysis before planning or execution.
---

# Clarify Intent Skill

Use this skill when a request is ambiguous, under-specified, or expensive to redo if misunderstood.

The goal is to improve **initial understanding** without changing the downstream workflow.

## When to Use

- The user request has multiple reasonable interpretations
- Success criteria are missing or vague
- Constraints or non-goals are unclear
- The affected scope, files, environment, or interface is unknown
- A wrong first step would waste time or create unnecessary edits
- The task is complex enough that shallow interpretation is risky

## Core Rules

1. Do **not** jump straight into execution when confidence is low.
2. Use the `question` tool early when clarification would materially change the plan or result.
3. Ask the **minimum number of high-signal questions** needed to unblock good execution.
4. Prefer **one focused question** with short options over a long list of vague questions.
5. Do not ask for details that can be safely inferred with low risk.
6. If you proceed without asking, briefly state the assumptions that matter.

## Intake Workflow

Before research, planning, delegation, or implementation, do this:

### 1) Extract the task frame

Identify internally:

- the user's explicit goal
- the likely implicit goal
- constraints
- unknowns
- risks
- what would make the result unacceptable

### 2) Decide whether clarification is required

Use the `question` tool first if any of the following are true:

- the desired end state is ambiguous
- there are multiple valid solution directions
- success criteria are missing
- constraints materially affect implementation
- the user may mean “minimal fix” or “complete solution” and that choice matters
- the scope is unclear enough that you may touch the wrong files or systems

### 3) Ask targeted questions

When asking questions:

- keep them concrete and decision-oriented
- ask about outcome, scope, constraints, or trade-offs
- avoid asking for information that can be discovered quickly with tools
- avoid stacking many low-value questions in one turn

Good topics to clarify:

- target outcome
- preferred scope (minimal / balanced / comprehensive)
- versions or environment details if they change the answer
- what must not be changed
- trade-offs the user prefers

### 4) Restate the task before action

After clarification, or after making safe assumptions, restate internally in 1-2 sentences:

- what you are solving
- what constraints you are respecting
- what the next best action is

Then continue with the normal workflow.

## Decision Standard

A good clarification question early is better than a fast but shallow execution.

If uncertainty is high and the cost of being wrong is non-trivial, pause and clarify first.

## Scope Discipline

This skill improves the **front-end understanding phase** only.

It should not cause unnecessary delay, over-questioning, or process changes once the task is sufficiently clear.
