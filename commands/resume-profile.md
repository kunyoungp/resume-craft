---
description: Build or update your resume profile (Q&A walkthrough)
allowed-tools: ["Read", "Write", "Edit", "Bash", "AskUserQuestion", "Skill"]
---

Invoke the `resume-craft:profile-builder` skill to guide the user through building their resume profile.

Before starting, check if `~/.claude/resume-craft/profile.json` already exists:
- If it exists: read it, show a summary of current profile sections, and ask which sections the user wants to update
- If it doesn't exist: create the directory `~/.claude/resume-craft/` and start the full Q&A flow

Follow the profile-builder skill instructions exactly. Save the completed profile to `~/.claude/resume-craft/profile.json` using the JSON Resume schema.

If the user wants to update specific sections, only walk through those sections while preserving all other data in the existing profile.json.
