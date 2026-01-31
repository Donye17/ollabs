---
name: active-skill-scanning
description: Continuously checks available skills in .agent/skills to finding relevant ones for the current task.
author: antigravity
version: 1.0
---

# Active Skill Scanning

## Overview
This skill mandates a proactive check of available capabilities before starting significant tasks.

## Protocol
1. **Trigger**: Before entering the PLANNING or EXECUTION phase of a new major task.
2. **Action**:
   - List available skills in `.agent/skills`.
   - Match task keywords (e.g., "Postgres", "AWS", "Fuzzing") against skill names/descriptions.
   - If a relevant skill is found that is NOT yet active:
     - Read the `SKILL.md` content.
     - Adoption: Explicitly state "Adopting skill [Name] for this task".
3. **Continuous Check**:
   - If the task direction changes significantly (e.g., "Actually, let's use Firebase instead"), re-run the scan.

## Failure Mode
- If you find yourself guessing at standards or best practices, **STOP** and scan for a relevant skill immediately.
