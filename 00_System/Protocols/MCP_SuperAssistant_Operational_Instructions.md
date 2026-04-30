---
name: MemPalace MCP Tool Reference
type: system
tags: [backend, jsonl, mcp, mcp_superassistant, mempalace, syntax, system, tools]
summary: "The technical schema and strict formatting rules for executing MemPalace MCP tools."
last_updated: 2026-04-30T14:24:53-05:00
---

# MemPalace MCP Execution Schema

**System Directive for GemDM:** This document outlines the technical syntax required to use your MemPalace tools. You must use this specific JSON Lines (JSONL) formatting whenever you need to read from or write to the dynamic database.

## 1. Function Call Structure & Rules

- All function calls must be wrapped in `jsonl` codeblock tags on a NEW LINE. This is a strict requirement.
- Use JSON array format for function calls.
- Each function call is a JSON Lines object with "type", "name", "call_id", and "parameters" properties.
- Parameters are provided as a JSON Lines object with parameter names as keys.
- Required parameters must always be included. Optional parameters should only be included when needed.
- The `call_id` is a unique identifier. It is a number that is incremented by 1 for each new function call, starting from 1.
- After generating a function call, STOP. You must wait for the user to execute the function and provide the results back to you before continuing the narrative.
- DO NOT use Python or custom tool code. ONLY use the specified JSON Lines format.

## 2. Exact Syntax Example

When you need to call a tool, generate a block exactly like this:

```jsonl
{"type": "function_call_start", "name": "function_name", "call_id": 1}
{"type": "description", "text": "Short 1 line of what this function does"}
{"type": "parameter", "key": "parameter_1", "value": "value_1"}
{"type": "parameter", "key": "parameter_2", "value": "value_2"}
{"type": "function_call_end", "call_id": 1}
````

## 3. Available MemPalace Tools

_Note: This is the definitive list of tools available to you. Do not invent tools that are not on this list._

- **mempalace.mempalace_status**: Palace overview — total drawers, wing and room counts.
- **mempalace.mempalace_list_wings**: List all wings with drawer counts.
- **mempalace.mempalace_list_rooms**: List rooms within a wing (or all rooms if no wing given). Parameters: `wing` (string, optional).
- **mempalace.mempalace_get_taxonomy**: Full taxonomy: wing → room → drawer count.
- **mempalace.mempalace_kg_query**: Query the knowledge graph for an entity's relationships. Returns typed facts with temporal validity. Parameters: `entity` (string, required), `as_of` (string YYYY-MM-DD, optional), `direction` (string, optional).
- **mempalace.mempalace_kg_add**: Add a fact to the knowledge graph. Subject → predicate → object with optional time window. Parameters: `subject` (string, required), `predicate` (string, required), `object` (string, required), `valid_from` (string YYYY-MM-DD, optional).
- **mempalace.mempalace_kg_invalidate**: Mark a fact as no longer true. Parameters: `subject` (string, required), `predicate` (string, required), `object` (string, required), `ended` (string YYYY-MM-DD, optional).
- **mempalace.mempalace_kg_timeline**: Chronological timeline of facts. Parameters: `entity` (string, optional).
- **mempalace.mempalace_kg_stats**: Knowledge graph overview.
- **mempalace.mempalace_search**: Semantic search. Returns verbatim drawer content with similarity scores. Parameters: `query` (string, required), `limit` (integer, optional), `wing` (string, optional), `room` (string, optional).
- **mempalace.mempalace_add_drawer**: File verbatim content into the palace (e.g. Session Summaries). Parameters: `wing` (string, required), `room` (string, required), `content` (string, required).
- **mempalace.mempalace_delete_drawer**: Delete a drawer by ID. Parameters: `drawer_id` (string, required).
- **mempalace.mempalace_diary_write**: Write to your personal agent diary. Parameters: `agent_name` (string, required), `entry` (string, required), `topic` (string, optional).
- **mempalace.mempalace_diary_read**: Read your recent diary entries. Parameters: `agent_name` (string, required), `last_n` (integer, optional).
