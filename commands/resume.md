---
description: Generate a tailored resume and optional cover letter for a job application
argument-hint: [job-url-or-paste-text]
allowed-tools: ["Read", "Write", "Edit", "Bash", "AskUserQuestion", "Glob", "Grep", "Agent", "Skill", "WebFetch"]
---

Generate a tailored resume and optional cover letter for a specific job application.

## Prerequisites Check

1. Check if `~/.claude/resume-craft/profile.json` exists.
   - If NOT: tell the user "You need to set up your profile first. Run `/resume-profile` to get started." and STOP.
2. Check if `~/.claude/resume-craft/preferences.json` exists.
   - If NOT: use "modern" as the default template and inform the user they can run `/resume-templates` to change it later.

## Step 1: Get Job Description

If `$ARGUMENTS` is provided:
- If it looks like a URL (starts with http:// or https://): attempt to scrape it using `node ${CLAUDE_PLUGIN_ROOT}/scripts/scrape-job.mjs "$ARGUMENTS"`
  - If the script exits with code 0: use the output as the JD text
  - If it fails: ask the user to paste the job description text directly
- Otherwise: treat $ARGUMENTS as the beginning of pasted JD text. Ask the user if there's more.

If no arguments provided: ask the user to either provide a URL or paste the job description text.

## Step 2: Analyze Job Description

Invoke the `resume-craft:job-analysis` skill. Analyze the JD text to extract:
- Role title, company name, seniority level
- Required and preferred skills
- Top 15-20 ATS keywords
- Key responsibilities (top 5-7)
- Culture signals
- Industry/profession classification

Present a brief summary of the analysis to the user and ask if it looks correct before proceeding.

## Step 3: Template Selection

Read `~/.claude/resume-craft/preferences.json` for the saved template choice.
- If a template is set: confirm with the user ("Using the '{template}' template. OK, or want to change?")
- If set to "auto" or based on JD analysis: suggest the best-fit template for this job's profession classification

## Step 4: Generate Resume

Read the user profile from `~/.claude/resume-craft/profile.json`.
Read the selected template from `${CLAUDE_PLUGIN_ROOT}/templates/{template}/index.html` (or custom path).
Read the cover letter profile from `~/.claude/resume-craft/cover-letter-profile.json` if it exists.

Invoke the `resume-craft:resume-generation` skill for writing guidelines.

Generate the resume by:
1. Creating output directory: `~/.claude/resume-craft/outputs/YYYY-MM-DD-{company-name-slug}/`
2. Taking the template HTML and replacing all sample content with tailored content from the user's profile
3. Tailoring every bullet point to match JD keywords (target 65-75% keyword match)
4. Writing each bullet as: Action Verb + Task/Project + Quantified Result
5. Ensuring AI-avoidance rules are followed (reference: `@${CLAUDE_PLUGIN_ROOT}/skills/resume-generation/references/ai-avoidance.md`)
6. Saving as `resume.html` in the output directory

## Step 5: Cover Letter (Optional)

Ask the user: "Would you also like a cover letter for this application?"

If yes:
- Generate a cover letter using Problem-Solution format (250-400 words)
- Use the cover letter context from cover-letter-profile.json for tone and personal stories
- Reference specific company details from the JD analysis
- Save as `cover-letter.html` in the same output directory using a clean HTML format

If no: skip to Step 6.

## Step 6: Verification

Invoke the `resume-craft:verification` skill. Verify the generated documents:

1. **Factual accuracy**: Cross-reference every claim against profile.json
2. **AI-detection scan**: Check for banned words, sentence pattern issues
3. **Professional quality**: Bullet format, keyword match rate, section ordering

If issues are found:
- Show the verification report to the user
- Fix the flagged issues automatically (rewrite banned words, adjust sentence patterns)
- Re-verify to confirm fixes

Continue until verification passes clean.

## Step 7: Preview

Open the resume in the browser for preview:
```bash
open ~/.claude/resume-craft/outputs/{date}-{company}/resume.html
```

If a cover letter was generated, open it too.

Tell the user: "Preview is open in your browser. Take a look and let me know if you'd like any changes."

## Step 8: Edit Loop

Wait for user feedback. Common edit requests:
- "Make the summary shorter/longer"
- "Emphasize [skill] more"
- "Remove the [section]"
- "Change the tone of the cover letter"
- "Add my [project/certification]"

For each edit:
1. Make the requested changes to the HTML
2. Re-run verification (at minimum Phase 2: AI-detection)
3. Re-open the preview
4. Ask if there are more changes

Continue until the user says they're satisfied.

## Step 9: Export PDF

Once approved, export to PDF:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.mjs \
  ~/.claude/resume-craft/outputs/{date}-{company}/resume.html \
  ~/.claude/resume-craft/outputs/{date}-{company}/resume.pdf
```

If cover letter exists, export it too:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.mjs \
  ~/.claude/resume-craft/outputs/{date}-{company}/cover-letter.html \
  ~/.claude/resume-craft/outputs/{date}-{company}/cover-letter.pdf
```

Tell the user the final location of all files:
```
Your resume is ready!

Files saved to: ~/.claude/resume-craft/outputs/{date}-{company}/
- resume.html
- resume.pdf
- cover-letter.html (if generated)
- cover-letter.pdf (if generated)
```
