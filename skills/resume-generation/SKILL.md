---
name: resume-generation
description: This skill should be used when the user asks to "generate a resume", "write a resume", "create a cover letter", "tailor my resume", or needs guidance on resume writing best practices and template selection.
version: 0.1.0
---

# Resume & Cover Letter Generation

Generate professional, ATS-optimized resumes and cover letters that read as authentically human. Follow every rule below when producing resume or cover letter content. These rules are non-negotiable — they directly determine whether a candidate passes automated screening and impresses a human reader.

---

## Language Matching

The resume and cover letter MUST be written in the same language as the job posting. This is determined during job analysis and confirmed with the user before generation begins.

### Rules

- **All content** — section headers, professional summary, bullet points, cover letter paragraphs — must be in the target language
- **Technical terms stay as-is** — Tool names ("React", "PostgreSQL"), certifications ("AWS Certified"), product names, and widely-recognized acronyms should remain in their original form regardless of target language. These are universal and ATS systems match on exact strings.
- **Natural translation, not literal** — When the user's profile is in a different language than the JD, translate achievements and descriptions idiomatically. A stiff, word-for-word translation reads worse than a slightly reworded version that sounds natural.
- **Professional register** — Each language has its own conventions for professional documents. Match them:
  - Korean: formal polite style (~했습니다, ~하였습니다), 존댓말 throughout
  - Japanese: です/ます form, appropriate keigo
  - German: formal Sie form
  - French: professional register, vous form
  - Spanish: formal usted form for business contexts
  - Other languages: use the standard formal/professional register
- **AI-avoidance in any language** — The banned word list in `references/ai-avoidance.md` is English-specific, but the principle applies universally. Avoid generic, overused filler phrases in whatever language you're writing. Be specific, concrete, and authentic.

---

## Resume Writing Rules

### Bullet Point Formula

Write every single work experience bullet point using this exact structure:

**Action Verb + Task/Project + Quantified Result**

- BAD: "Responsible for managing projects"
- BAD: "Worked on improving the website"
- BAD: "Helped with customer service"
- GOOD: "Led a cross-functional team of 8 to deliver a $1.2M project 3 weeks ahead of schedule"
- GOOD: "Rebuilt the checkout flow in React, cutting cart abandonment by 23% over 3 months"
- GOOD: "Resolved 150+ customer escalations per month with a 4.9/5.0 satisfaction rating"

Every claim must include a specific, verifiable detail. That means a number, a metric, a project name, a date, a tool, or a company name. If the user's profile does not contain a metric, coach them to provide one or construct a reasonable framing from context — but never fabricate data.

### Section Order

Arrange resume sections in this order:

1. **Contact Information** — Name, email, phone, city/region, LinkedIn, portfolio URL
2. **Professional Summary** — 2-3 sentences tailored to the specific job. This section carries the highest weight in ATS scoring. Front-load it with the most important keywords from the job description.
3. **Skills / Core Competencies** — Group by category (Technical, Domain, Tools, Soft Skills). Include both acronyms and full forms: "Search Engine Optimization (SEO)", "Continuous Integration/Continuous Deployment (CI/CD)".
4. **Work Experience** — Reverse chronological. Each role gets 3-5 bullet points following the formula above.
5. **Education** — Institution, degree, field, graduation year. Include GPA only if above 3.5 or if honors apply.
6. **Optional Sections** — Certifications, Projects, Awards, Publications, Volunteer Work, Languages. Include only if relevant to the target role.

### Keyword Strategy

Mirror exact language from the job description. If the JD says "cross-functional collaboration," use that exact phrase — not "working across teams" or "interdepartmental cooperation." ATS systems match on exact strings first, then use NLP for semantic similarity, but exact matches always score higher.

Target a 65-75% keyword match rate against the job description. Count how many of the top 20 JD keywords appear in the resume. If the rate falls below 65%, revise to incorporate more keywords naturally.

Include both the acronym and the spelled-out version for any technical term: "Machine Learning (ML)", "Amazon Web Services (AWS)", "Key Performance Indicators (KPIs)".

### Action Verb Variety

Use 20-30 different action verbs across a one-page resume. Never start two consecutive bullets with the same verb. Rotate across categories — leadership verbs, technical verbs, analysis verbs, operations verbs. Refer to `references/action-verbs.md` for categorized lists.

### Page Length

- Less than 5 years of experience: 1 page, no exceptions.
- 5 or more years of experience: 2 pages maximum.

Cut older or less relevant roles to meet the limit. Prioritize recent experience and achievements most relevant to the target role.

### Professional Summary Guidelines

Write the professional summary as 2-3 sentences. Tailor it to every specific application — never use a generic summary. Lead with the candidate's specialty and years of experience, then highlight the most relevant achievement or skill area for the target role. Pack the most critical JD keywords into this section because ATS systems weight it highest.

BAD: "Results-driven professional with a track record of success in leveraging innovative solutions."
GOOD: "Backend engineer with 6 years building distributed systems in Go and Python. Reduced API latency by 40% at Acme Corp by redesigning the caching layer, serving 10M+ daily requests."

---

## Match-Based Content Strategy

When match analysis data is available from the gap clarification step (Step 2d), use these rules to prioritize and weight content throughout the resume and cover letter.

### Content Ordering by Match Strength

**Professional Summary (highest impact):**
- The summary MUST open with the candidate's strongest match to the JD. If the JD's primary requirement is "5+ years of Python backend development" and the user has 7 years, that goes first.
- Pack the summary with strong-match keywords. Every word in the summary should earn its place by addressing a JD requirement.
- Do not waste summary space on skills or experience that don't map to JD requirements.

**Work Experience Bullets:**
- Within each role, order bullets by relevance to the JD — strongest matches first.
- If a role has 4-5 bullets, at least the first 2 should directly demonstrate a required skill or address a key responsibility from the JD.
- Bullets demonstrating strong-match skills may be given slightly more detail (the full Action + Task + Result treatment with specific metrics).
- Bullets for non-matching experience can be more concise — they show breadth but should not dominate.

**Skills Section:**
- Within each skill category, list JD-matching skills before non-matching ones.
- If the JD uses specific groupings (e.g., "Experience with AWS services (EC2, S3, Lambda)"), mirror that grouping in the skills section.

### Handling User-Clarified Gaps

When the user provided related experience during the gap clarification step that is not in their profile:

1. **Incorporate it as a legitimate bullet or skill mention** — the user confirmed this experience, so it carries the same factual weight as profile data.
2. **Frame it using transferable language** — do not claim the exact skill the JD requires if the user has a related but different skill. Instead, describe what they DID do in a way that demonstrates the underlying competency.
   - Example: JD requires "Kubernetes." User clarified they managed Docker Swarm clusters. Write: "Orchestrated containerized microservices across a 12-node Docker Swarm cluster, managing deployment pipelines and service discovery for 30+ services." This honestly represents their experience while demonstrating container orchestration competency.
3. **Place these bullets strategically** — in a work experience role where the related experience occurred, positioned after direct-match bullets but before unrelated content.

### Handling Confirmed Gaps (No Coverage)

When a skill is confirmed as a gap with no related experience:

1. **Do not mention it.** Do not try to imply proficiency through vague language.
2. **Do not leave a visible hole** — instead, strengthen the surrounding content to emphasize what the user DOES bring. If a required skill is missing, the resume should compensate by making the user's other qualifications exceptionally compelling.
3. **In the skills section**, do not list the missing skill. Only list skills the user genuinely has.

### Cover Letter Match Strategy

- **Opening hook:** Always anchor to the single strongest match between the user's experience and the JD's primary requirement. The first sentence should make the hiring manager think "this person has exactly what we need."
- **Achievement expansion:** Choose 1-2 achievements to expand that directly address the role's top responsibilities. Prefer achievements where the user can cite specific metrics that map to the job's scope.
- **Addressing clarified gaps (optional, use judgment):** If the user clarified relevant adjacent experience for a major gap, it CAN be briefly mentioned in the cover letter as a demonstration of learning agility or breadth — but only if it strengthens the narrative. Do not force it.
- **Never mention confirmed gaps.** The cover letter should project confidence, not apologize for missing skills.

---

## Cover Letter Rules

### Length and Structure

Write cover letters at 250-400 words in 3-4 paragraphs. Not a word more.

### Paragraph Breakdown

**Opening paragraph:** Start with a concrete hook. Lead with a specific achievement, a direct insight about the company, or a clear statement about the problem the candidate solves. NEVER open with "I am writing to apply for..." or "I am excited to apply..." or any variation of those phrases. The opening must make the reader want to keep reading.

- BAD: "I am excited to apply for the Senior Engineer role at Acme Corp."
- BAD: "I am passionate about leveraging technology to drive innovation."
- GOOD: "Last quarter I rebuilt Acme's payment processing pipeline, cutting transaction failures by 67% — and I'd like to bring that same approach to your checkout infrastructure team."
- GOOD: "Your blog post on migrating to event-driven architecture caught my attention because I spent the last two years doing exactly that at Scale Corp."

**Middle paragraphs (1-2):** Take 1-2 achievements from the resume and expand them with the story behind them. Add context that does not fit in a resume bullet — the challenge, the approach, the unexpected complication, the outcome. Quantify everything. Do not repeat resume bullets verbatim; expand on them.

**Closing paragraph:** Deliver a confident call to action. Reiterate fit for the role in one sentence. Invite a conversation. Do not beg or be passive ("I hope to hear from you"). Be direct ("I'd welcome the chance to walk you through how I'd approach your API scalability challenges — are you free for 30 minutes next week?").

### Tone and Voice

Write as if speaking to a person, not filing a form. Reference specific company projects, recent news, stated values, or team details from the job description. Generic praise ("Your company is a leader in innovation") is worse than saying nothing. Be specific or skip it.

Expand on resume content — never copy it. The cover letter is where the candidate's personality and thinking come through. Show how they think about problems, not just what they accomplished.

---

## Template Selection Guidance

Select the template based on the target role's industry and profession:

| Template | Best For |
|---|---|
| `minimal` | Tech, engineering, software development |
| `professional` | Business, finance, consulting, accounting |
| `modern` | General roles, startups, product management |
| `academic` | Research, education, academia, science |
| `creative` | Design, marketing, advertising, media |
| `executive` | Senior leadership, C-suite, director+, VP |

When the job analysis identifies the profession/industry classification, map it to the template above. If the user has a preference, respect it — but note if it conflicts with industry norms.

### Custom Template Mode

When no pre-built template is used (`"template": "custom"` in preferences.json), refer to the `frontend-design` skill (`${CLAUDE_PLUGIN_ROOT}/skills/frontend-design/SKILL.md`) for comprehensive design guidance including typography pairing, color palette creation, atmospheric CSS techniques, and aesthetic presets. The custom resume must still comply with all ATS formatting rules from `references/ats-optimization.md`.

### Template Selection Details

**minimal** — Clean, no-frills layout with plenty of white space. Technology professionals expect this format. Avoids decorative elements that distract from technical content. Works well with dense skills sections and project descriptions.

**professional** — Structured, traditional layout with clear hierarchy. Finance and consulting professionals expect a polished, conservative appearance. Emphasizes work history and credentials. Suitable for regulated industries where formality matters.

**modern** — Balanced layout that blends clean design with subtle visual interest. Good default choice when the industry is unclear or when the company culture suggests a blend of professional and approachable. Works across most generalist roles.

**academic** — Optimized for research roles with emphasis on publications, grants, teaching experience, and research interests. Supports longer formats common in academic CVs. Includes sections for conference presentations and academic service.

**creative** — Allows for more visual personality while remaining ATS-compatible. Suitable for roles where design sense is part of the evaluation. Balances creative expression with readability and parseability.

**executive** — Designed for senior leaders. Emphasizes strategic impact, board experience, P&L ownership, and organizational transformation. Supports concise executive summaries with high-level metrics. Appropriate for roles where scope and scale of leadership matter more than technical detail.

---

## Formatting and ATS Compliance

Follow all ATS formatting rules from `references/ats-optimization.md`. The critical rules to apply during generation:

- Single-column layout only — no multi-column designs
- Standard section headers that ATS parsers recognize
- Contact information in the document body, not in headers or footers
- Consistent date formatting throughout the document
- No graphics, tables, logos, or images in content sections
- Both acronym and full form for technical terms: "Machine Learning (ML)"
- Standard fonts at 10-12pt size

For visual design guidance beyond ATS compliance (typography, color, atmosphere), see the `frontend-design` skill.

---

## AI-Avoidance and Quality

Every piece of generated content must pass three checks before delivery:

1. **AI-detection scan** — Scan for banned words and phrases. Replace every instance found. See `references/ai-avoidance.md` for the full banned list and replacement guidance.
2. **Structural naturalness** — Vary sentence lengths. Mix short punchy sentences with longer detailed ones. Use contractions naturally. Avoid the "rule of three" pattern in consecutive bullets.
3. **Read aloud test** — If any sentence sounds like a press release, a corporate memo, or a college admissions essay, rewrite it until it sounds like something a real person would say in a job interview.

---

## Reference Files

Consult these reference files during generation:

- **AI-avoidance rules and banned word list:** `references/ai-avoidance.md`
- **ATS optimization and formatting rules:** `references/ats-optimization.md`
- **Action verb lists organized by category:** `references/action-verbs.md`

Apply every rule from these references. They are not suggestions — they are requirements.
