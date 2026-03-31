---
name: job-analysis
description: This skill should be used when the user asks to "analyze a job description", "parse a job posting", "review a JD", "extract keywords from a job listing", or needs help understanding what a job requires for resume tailoring.
version: 0.1.0
---

# Job Description Analysis

Analyze job descriptions to extract structured information for resume and cover letter tailoring. The output of this analysis feeds directly into resume generation and keyword optimization. Be thorough — missing a key requirement means the resume will be incomplete.

---

## Getting the Job Description

### Option 1: URL Provided

If the user provides a URL to a job posting, attempt to scrape it:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/scrape-job.mjs "<url>"
```

Check the exit code. If the script exits with code 0, use the scraped content. If it exits with code 1 (scraping failed), inform the user and ask them to paste the job description text directly:

"I wasn't able to scrape that URL. Could you copy and paste the full job description text here instead?"

### Option 2: Text Provided Directly

If the user pastes the job description text directly, use it as-is. Do not ask them to provide a URL instead — pasted text is perfectly fine.

### Option 3: Neither Provided

If the user invokes this skill without providing either a URL or text, ask: "Please share the job description — you can either paste the text directly or give me a URL to the job posting."

---

## Analysis Framework

Extract and organize the following from the job description. Be systematic — go through each category even if some have no matches.

### 1. Role Basics

Extract these core details:

- **Job title** — The exact title as stated in the JD
- **Company name** — The hiring company
- **Department/Team** — If mentioned (e.g., "Platform Engineering team", "Growth Marketing")
- **Location** — City, state, country. Note if remote, hybrid, or on-site. Note any relocation requirements.
- **Seniority level** — Classify into one of: entry, mid, senior, lead, staff, principal, director, VP, C-suite. Use both explicit statements ("Senior Engineer") and contextual clues (years of experience required, scope of responsibilities).
- **Employment type** — Full-time, part-time, contract, freelance, internship

### 2. Required Skills

List every hard requirement explicitly stated in the JD. These are typically in a "Requirements," "Qualifications," or "Must have" section. Use the exact wording from the JD.

Examples of required skills:
- "5+ years of experience with Python"
- "Bachelor's degree in Computer Science or related field"
- "Experience with AWS services (EC2, S3, Lambda)"
- "Strong SQL skills"

Flag requirements the user's profile may not meet — these are gaps that need to be addressed strategically (through transferable skills or framing) rather than ignored.

### 3. Preferred Skills

List nice-to-haves, "bonus" qualifications, and "preferred" items. These typically appear in a "Nice to have," "Preferred," or "Bonus" section.

Examples:
- "Experience with Kubernetes is a plus"
- "Familiarity with event-driven architecture preferred"
- "MBA is a bonus"

These are opportunities — if the user's profile includes any of these, they should be prominently featured.

### 4. Key Responsibilities

Summarize the top 5-7 things the person will actually do day-to-day. Distill from the "Responsibilities" or "What you'll do" section. Keep each to one sentence. Focus on the most important and most frequently mentioned duties.

Examples:
- "Design and build scalable backend services for the core platform"
- "Lead a team of 4-6 engineers on feature development"
- "Partner with product and design teams to define technical requirements"

### 5. Keywords for ATS

Extract the top 15-20 keywords and phrases that should appear in the tailored resume. Prioritize in this order:

1. **Exact tool and technology names** — "React", "PostgreSQL", "Terraform", "Figma"
2. **Methodologies and frameworks** — "Agile", "Scrum", "CI/CD", "Test-Driven Development"
3. **Certifications mentioned** — "AWS Certified Solutions Architect", "PMP", "CPA"
4. **Industry-specific terminology** — "SaaS", "B2B", "regulatory compliance", "HIPAA"
5. **Soft skill keywords** — "cross-functional collaboration", "mentorship", "stakeholder management"

Use the exact phrasing from the JD. If the JD says "cross-functional collaboration," the keyword is "cross-functional collaboration" — not "working across teams."

### 6. Culture Signals

Read between the lines of the JD to identify what the company values and how they work. Look for:

- **Work style descriptors** — "fast-paced environment," "self-starter," "autonomous," "collaborative team"
- **Values emphasized** — "diversity and inclusion," "customer obsession," "move fast and break things," "quality over speed"
- **Team structure clues** — "small, tight-knit team," "global team across 5 offices," "cross-functional pod"
- **Growth signals** — "rapidly growing startup," "Series B," "Fortune 500," "established market leader"
- **Red flags or notable aspects** — excessive emphasis on "wearing many hats" may signal under-resourcing; "rockstar" or "ninja" language may signal cultural issues

Summarize culture signals in 2-3 sentences. These inform the tone of the cover letter and the framing of experience.

### 7. Profession/Industry Classification

Classify the role into one of these categories based on the overall nature of the job:

| Classification | When to Use |
|---|---|
| tech/engineering | Software, hardware, DevOps, data engineering, IT, cybersecurity |
| business/finance | Accounting, finance, consulting, banking, business analysis |
| creative/design | Graphic design, UX/UI, marketing, advertising, content, media |
| academic/research | University positions, research roles, scientific roles, teaching |
| executive/leadership | C-suite, VP, director-level roles across any industry |
| general | Operations, HR, project management, customer success, other |

This classification drives the template suggestion in resume generation:
- tech/engineering → `minimal` template
- business/finance → `professional` template
- creative/design → `creative` template
- academic/research → `academic` template
- executive/leadership → `executive` template
- general → `modern` template

### 8. Experience Level Indicators

Extract all signals about the expected experience level:

- Years of experience explicitly stated ("5+ years", "3-7 years")
- Education requirements ("Bachelor's required, Master's preferred")
- Certifications required or preferred
- Scope of responsibility (managing budget, team size, revenue targets)
- Title level (the word "Senior" vs "Junior" vs no qualifier)

---

## Output Format

Present the analysis to the user in this structured format:

```
**Role:** [Exact Title] at [Company Name]
**Level:** [Seniority Classification]
**Location:** [Location + remote/hybrid/on-site]
**Type:** [Employment type]
**Industry:** [Classification] → Suggested template: [template name]

---

**Top Keywords (for ATS):**
[comma-separated list of 15-20 keywords, ordered by importance]

---

**Required Qualifications:**
- [each requirement as a bullet, using exact JD wording]

**Preferred Qualifications:**
- [each preferred item as a bullet]

---

**Key Responsibilities (Top 5-7):**
1. [responsibility]
2. [responsibility]
3. [responsibility]
4. [responsibility]
5. [responsibility]

---

**Culture Notes:**
[2-3 sentences summarizing what the JD reveals about company culture, work style, and team dynamics]

---

**Experience Level:**
- Years required: [X]
- Education: [requirement]
- Certifications: [if any]
```

---

## Gap Analysis (When Profile Is Available)

If `~/.claude/resume-craft/profile.json` exists, perform an automatic gap analysis after presenting the JD analysis:

1. Compare the required skills list against the user's profile skills.
2. Identify matches (skills the user has that the JD requires).
3. Identify gaps (skills the JD requires that the user does not have listed).
4. For each gap, suggest a strategy:
   - **Transferable skill framing** — "You don't list 'Kubernetes' but you have 'Docker' and 'AWS ECS' — we can frame your containerization experience to partially cover this."
   - **Honest omission** — "The JD requires 'CPA certification' and you don't have it. We'll focus on your other financial qualifications instead."
   - **Upskilling note** — "The JD prefers 'GraphQL' — if you have any exposure, even from a side project, we should include it."

5. Calculate a preliminary keyword match rate: count how many of the top 20 extracted keywords appear in the user's profile, and report the percentage.

Present the gap analysis clearly:

```
**Gap Analysis:**
- Matching keywords: X/20 (Y%)
- Strong matches: [list skills that directly match]
- Partial matches: [list transferable skills]
- Gaps: [list missing requirements with strategy notes]
```

This analysis gives the user full visibility into their fit and prepares the resume-generation skill to make strategic tailoring decisions.

---

## Handling Edge Cases

### Vague or Incomplete Job Descriptions

Some JDs are poorly written — they lack specific requirements, use generic language, or mix multiple roles into one posting. When this happens:

- Note which sections could not be fully extracted due to vague language.
- Infer seniority level from context clues (salary range if visible, scope of responsibilities, reporting structure).
- For keyword extraction, focus on any technical terms, tool names, or industry terminology that do appear, even if the requirements section is thin.
- Warn the user: "This JD is light on specifics. The keyword list may be shorter than ideal, and the resume tailoring will rely more on general industry keywords."

### Multiple Roles in One JD

Some postings describe multiple related roles (e.g., "Software Engineer I/II/III"). Identify the most likely target level based on the user's profile and tailor the analysis accordingly. Note the level ambiguity in the output.

### Internal Transfer Postings

Internal postings may omit company name or use internal jargon. Ask the user to clarify if the JD appears to be internal, and adjust the analysis to focus on team-specific keywords rather than company-level branding.

---

## Saving Analysis Results

Do not save the analysis to a file unless the user explicitly asks to save it. The analysis is presented conversationally and feeds into the next step of the workflow (resume generation) through context.

If the user asks to save it, write to `~/.claude/resume-craft/last-analysis.json` with the structured data from the analysis.
