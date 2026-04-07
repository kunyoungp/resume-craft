---
name: verification
description: This skill should be used when the user asks to "verify my resume", "check my resume", "review my cover letter", "run a quality check", "scan for AI detection", or needs to validate resume and cover letter quality before delivery.
version: 0.1.0
---

# Resume & Cover Letter Verification

Run a three-phase verification process on every resume and cover letter before delivering to the user. This is a quality gate — no document passes without meeting all standards. Be thorough, be specific, and flag every issue with an exact location and a concrete fix.

---

## Phase 1: Factual Accuracy

Zero tolerance for hallucinated or unverifiable content. Every claim in the document must trace back to the user's profile data.

### Setup

1. Read the user's profile from `~/.claude/resume-craft/profile.json`.
2. Read the generated resume or cover letter content (HTML file or in-memory content).
3. If the profile file does not exist, warn the user: "No profile found at ~/.claude/resume-craft/profile.json. I cannot verify factual accuracy without a profile. Please run the profile builder first or provide your profile data."

### Cross-Reference Checklist

Check every single claim in the document against the profile:

**Job titles** — Every job title in the resume must match the profile exactly. Do not accept creative rewordings. If the profile says "Software Engineer" and the resume says "Software Development Engineer," flag it. The only exception: if the user's actual title is very different from the JD title and the user explicitly approved a change.

**Company names** — Every company name must match the profile exactly. Check for typos, abbreviations, and variations ("Google" vs "Alphabet" vs "Google LLC").

**Dates** — Every start date and end date must match the profile. Check month and year. Flag any discrepancy, even by one month.

**Metrics and numbers** — Every quantified claim (percentages, dollar amounts, user counts, team sizes, time savings) must come directly from the profile's highlights or from information the user explicitly provided during the session. Do not accept metrics that appear to be fabricated or rounded in ways that exaggerate.

**Skills** — Every skill mentioned in the document must appear in the profile's skills section or be directly inferable from the work experience descriptions. Do not add skills the user never claimed.

**Education** — Degree type, institution name, field of study, and graduation year must all match the profile exactly.

**Certifications** — Every certification mentioned must appear in the profile. Do not invent certifications.

### User-Clarified Experience

During the gap clarification step (Step 2d), the user may have provided additional experience that is NOT in `profile.json` — for example, side projects, informal exposure, or transferable skills described verbally. This experience was confirmed directly by the user and should be treated as verified data.

When auditing, if a claim in the resume traces back to user-clarified experience from the gap clarification step (rather than profile.json), do NOT flag it as "UNVERIFIED." These are legitimate, user-confirmed facts. They will typically appear as transferable-skill bullets framed around related (not identical) experience.

If you cannot determine whether a claim came from user clarification or was fabricated, flag it as "UNVERIFIED — confirm if this was provided during gap clarification."

### Flagging

Flag any claim that cannot be traced to the profile as **"UNVERIFIED"**. Provide the exact text, its location in the document, and what the profile actually says (or that the profile has no corresponding data).

Example flags:
- "UNVERIFIED: Resume says 'Reduced API latency by 60%' but profile highlights say 'Reduced API latency by 40%.' Correcting to 40%."
- "UNVERIFIED: Resume mentions 'Certified Kubernetes Administrator' but this certification does not appear in the profile."
- "UNVERIFIED: Resume says 'Led a team of 15' but profile says team size was 12."

---

## Phase 2: AI-Detection Scan

Scan the document for patterns that AI-detection tools and experienced recruiters flag as machine-generated content.

### Banned Word/Phrase Check

Reference the banned word list from the resume-generation skill: `${CLAUDE_PLUGIN_ROOT}/skills/resume-generation/references/ai-avoidance.md`

Scan the entire document for every word and phrase on the banned list. For each match found:
- Note the exact location (section, bullet number, or paragraph)
- Quote the sentence containing the banned word
- Provide a specific rewrite that replaces the banned word with concrete, specific language

Example:
- Found: "Leveraged machine learning models to streamline data processing"
- Location: Work Experience, Role 2, Bullet 3
- Fix: "Applied gradient boosting models to cut data processing time from 6 hours to 45 minutes"

### Sentence Length Variation Check

Calculate the word count of every sentence in each section. Flag any sequence where more than 3 consecutive sentences have word counts within plus or minus 3 words of each other.

Example flag:
- "Professional Summary: sentences have 14, 15, 13, 14 words — monotonous rhythm detected. Vary by mixing a short sentence (5-8 words) with longer ones (18-25 words)."

### Rule of Three Pattern Check

Scan consecutive bullet points for the "Did X, Y, and Z" pattern. If this pattern appears in 3 or more consecutive bullets, flag it and rewrite at least one bullet to break the pattern.

### Contraction Check

Verify that contractions appear naturally in the cover letter. A 300-word cover letter with zero contractions reads as robotic. Flag if no contractions are found and suggest adding 3-5 natural contractions ("I've" instead of "I have," "don't" instead of "do not").

For resumes, contractions are less critical but still acceptable in the professional summary.

### Opening Line Check

Check the opening line of the professional summary and the cover letter. Flag if either starts with abstract enthusiasm rather than a specific fact.

Flag patterns like:
- "Passionate about..."
- "Results-driven professional..."
- "Dedicated and experienced..."
- "I am writing to apply..."
- "I am excited to apply..."

Require openings that contain at least one specific detail: a number, a technology, a company name, or a concrete achievement.

### Read Aloud Test

Mentally read every sentence. Flag any that sound like:
- A press release ("is pleased to announce," "is proud to present")
- A corporate memo ("ensure alignment," "drive initiatives," "leverage synergies")
- A college admissions essay ("unique perspective," "diverse experiences," "passionate about making a difference")

For each flagged sentence, provide a conversational rewrite.

---

## Phase 3: Professional Quality

### Bullet Point Format

Verify every work experience bullet follows the required format: **Action Verb + Task/Project + Quantified Result**.

Check each bullet for:
1. **Starts with an action verb** — not "Responsible for," not "Worked on," not a noun phrase. Flag and rewrite any that don't start with an action verb.
2. **Contains a task or project reference** — what was done, in what context.
3. **Contains a quantified result** — a number, percentage, dollar amount, or measurable outcome. Flag any bullet missing quantification.

### Keyword Match Rate

If JD keywords are available (from a prior job analysis), count how many of the top 20 JD keywords appear in the resume. Calculate the percentage.

- **65-75%:** Target range. Report as passing.
- **Below 65%:** Flag as failing. List the missing keywords and suggest where in the resume each could be naturally incorporated.
- **Above 75%:** Report as passing but check that the density feels natural — flag any keyword that appears more than 3 times.

If no JD keywords are available, skip this check and note it in the report.

### Section Order

Verify the resume follows standard section ordering:
1. Contact Information
2. Professional Summary
3. Skills / Core Competencies
4. Work Experience
5. Education
6. Optional sections

Flag if sections are out of order or if a required section is missing.

### Spelling and Grammar

Scan for obvious spelling errors, grammatical mistakes, and inconsistencies:
- Inconsistent tense (mixing past and present tense for completed roles)
- Missing periods or inconsistent punctuation in bullets
- Capitalization errors in proper nouns
- Typos in company names or tool names

### Page Length

Estimate the document length:
- Resume for candidates with less than 5 years of experience: should fit 1 page. Flag if it appears to exceed this.
- Resume for candidates with 5+ years: should fit 2 pages maximum. Flag if it appears to exceed this.

### Cover Letter Length

Count the words in the cover letter. Target is 250-400 words.
- Below 250: flag as too short, suggest areas to expand.
- Above 400: flag as too long, suggest areas to trim.

---

## Verification Report Format

Present findings in this structured format:

```
## Verification Report

**Overall:** PASS / NEEDS FIXES

### Factual Accuracy: PASS/FAIL
- [specific findings, each with location and detail]
- [corrections made or corrections needed]

### AI-Detection Scan: PASS/FAIL
- Banned words found: [count]
  - [each instance with location and suggested rewrite]
- Sentence rhythm: [pass/flag with details]
- Rule of three: [pass/flag]
- Contractions: [pass/flag]
- Opening lines: [pass/flag]

### Professional Quality: PASS/FAIL
- Bullet format compliance: X/Y bullets pass
  - [flagged bullets with rewrites]
- Keyword match rate: X% (target: 65-75%)
  - Missing keywords: [list]
- Section order: [pass/flag]
- Spelling/grammar: [findings]
- Length: [pass/flag]

### Auto-Fix Suggestions:
1. [Location]: "[original text]" → "[fixed text]"
2. [Location]: "[original text]" → "[fixed text]"
3. ...
```

---

## Auto-Fix Application

After presenting the report, automatically apply all auto-fix suggestions to the document. For each fix applied:
- State what was changed
- Show the before and after text
- Note the location in the document

If any fix is ambiguous or could change meaning, ask the user for confirmation before applying it. Only auto-apply fixes that are clearly corrections (factual errors, banned word replacements, formatting fixes).

After applying fixes, run a quick re-scan to verify:
- No new banned words were introduced by the rewrites
- The keyword match rate did not decrease
- No factual errors were introduced

Report the final state: "Applied X fixes. Document now passes all checks." or "Applied X fixes. Y issues remain that require your input."

---

## When to Run Verification

Run this full verification process:
- Automatically after every resume or cover letter generation, before delivering to the user
- When the user explicitly asks to verify or check a document
- After any manual edits the user makes to a generated document

Never deliver a resume or cover letter without running at least Phase 1 (Factual Accuracy) and Phase 2 (AI-Detection Scan). Phase 3 can be abbreviated for quick revisions but should be run in full for first-time generation.
