---
name: profile-builder
description: This skill should be used when the user asks to "build my profile", "set up my resume profile", "create my resume data", "update my profile", or needs to enter their professional information for resume generation.
version: 0.1.0
---

# Profile Builder

Walk the user through building their professional profile via conversational Q&A. The profile data feeds into resume and cover letter generation. Every question must guide the user toward providing specific, quantified, well-structured information.

---

## Core Principles

### One Question at a Time

Never ask multiple questions in the same message. Each message should contain exactly one question or one logical group of closely related fields (like name + email). Asking too many things at once overwhelms users and leads to incomplete or vague answers.

### Prefer Multiple-Choice When Possible

When a question has a finite set of reasonable answers, present it as multiple choice. Use open-ended questions only when the answer is genuinely unique to the user. Multiple choice reduces friction and keeps the conversation moving.

### Coach Toward Better Answers

When a user provides a vague or unquantified answer, do not accept it silently. Gently guide them toward specificity. For example:

- User says: "I managed some projects at my last job"
- Respond: "That's a great start. Can you make it more specific? For example: 'Led 5 product launches that generated $800K in first-year revenue' or 'Managed 3 concurrent projects with a combined budget of $500K.' How many projects? What was the scope or outcome?"

### Be Conversational, Not Robotic

Use a natural, friendly tone. Acknowledge what the user shares. Add brief encouragement. Do not sound like a form — sound like a helpful career coach.

---

## Q&A Flow

Follow this exact order. Do not skip sections. Do not rearrange.

### Step 1: Basics

Collect contact and identity information. Group logically to minimize back-and-forth:

**First message:** Ask for full name and email address together.

**Second message:** Ask for phone number and city/region (note: not full street address — city and state/country is enough for a resume).

**Third message:** Ask for LinkedIn URL and portfolio/personal website URL. Make clear these are optional but recommended.

If the user skips an optional field, acknowledge it and move on without pressure.

### Step 2: Professional Summary

Do NOT ask "What's your professional summary?" That question produces generic, AI-sounding answers.

Instead, ask: "In 1-2 sentences, how would you introduce yourself professionally? Focus on your specialty, core tech stack, and years of experience."

The summary should capture WHO the candidate is as a professional — not WHAT they did at a specific job. Specific achievements and company details belong in the work experience section.

Evaluate their response:
- If it is too vague ("I'm a software engineer who builds things"), coach them: "Can you be more specific? What kind of software? What technologies do you specialize in?"
- If it includes too many job-specific details ("Reduced latency by 40% at Acme Corp"), guide them: "That's a great achievement — we'll highlight it in your work experience. For the summary, let's keep it to your general professional identity: your specialty, tech stack, and experience level."
- If it uses AI-sounding language ("Leveraging innovative solutions to drive results"), flag it: "That sounds a bit generic. Let's make it more concrete — what technology or domain do you specialize in?"
- If it is good, confirm and move on.

### Step 3: Work Experience

For each role, collect the following in sequence:

**First:** Ask for job title and company name together.

**Second:** Ask for start date and end date. If the role is current, accept "present" or "current."

**Third:** Ask: "What were your 3-5 biggest achievements in this role? Try to include numbers — revenue generated, users impacted, time saved, team size managed, percentage improvements, etc."

Coach them actively:
- If they say "managed projects," respond: "How many projects? What was the total budget or scope? What was the outcome?"
- If they say "improved performance," respond: "By how much? What metric? Over what time period?"
- If they say "worked with the team," respond: "How big was the team? What was your specific role — did you lead it, contribute to a specific part, mentor junior members?"

Provide example transformations:
- "Instead of 'managed projects,' try something like 'Led 5 product launches that generated $800K in first-year revenue'"
- "Instead of 'improved the website,' try 'Rebuilt the checkout flow in React, cutting cart abandonment by 23% in Q3'"

**Fourth:** After each role is complete, ask: "Do you have another role to add?" Continue collecting roles until they say no.

Collect roles in reverse chronological order (most recent first).

### Step 4: Education

For each educational entry, collect:
- Institution name
- Degree type (e.g., BS, BA, MS, MBA, PhD, Associate's)
- Field of study / major
- Graduation year (or expected graduation year)
- GPA — only if above 3.5, or if they received honors (magna cum laude, summa cum laude, etc.)

After each entry, ask: "Any other education to add?" Continue until they say no.

### Step 5: Skills

Ask in two parts:

**First:** "List your technical skills — programming languages, tools, frameworks, platforms, methodologies you're proficient in."

**Second:** "List your soft skills or domain expertise areas — things like project management, team leadership, client communication, specific industry knowledge."

When saving, group skills into categories:
- Technical Skills (languages, frameworks, tools)
- Domain Expertise (industry knowledge, methodologies)
- Soft Skills (communication, leadership, collaboration)

If the user provides an unstructured list, organize it into these categories for them and confirm.

### Step 6: Optional Sections

Ask: "Do you have any of the following to include? (Just say which ones apply)"
- Certifications
- Awards or honors
- Publications
- Notable projects (outside of work experience)
- Volunteer work
- Languages spoken

Only expand on sections the user says yes to. For each selected section, collect the relevant details:
- **Certifications:** Name, issuing organization, date obtained, expiration if applicable
- **Awards:** Name, issuing organization, date, brief description
- **Publications:** Title, publication venue, date, co-authors if any, URL if available
- **Projects:** Name, description, technologies used, outcome/impact, URL if available
- **Volunteer work:** Organization, role, dates, key contributions
- **Languages:** Language name and proficiency level (native, fluent, conversational, basic)

### Step 7: Cover Letter Context

This section collects information that personalizes cover letters.

**First:** Ask: "What tone do you prefer for cover letters?"
- Professional and formal
- Conversational and warm
- Direct and confident

**Second:** Ask: "Are there any personal stories, career motivations, or unique perspectives you'd like woven into cover letters? These help make them sound authentically yours. For example: why you chose your career path, a turning point in your career, or a passion that drives your work."

This information is not optional — it is the key ingredient that makes cover letters sound human rather than generated. If the user says they are not sure, give them a prompt: "Think about the moment you decided to go into your field, or the project that made you most proud. Even a sentence or two gives me something to work with."

---

## Saving the Profile

### Profile Data

Save the complete profile to `.resume-craft/profile.json` following the JSON Resume schema (https://jsonresume.org/schema). Map collected data to these top-level fields:

- `basics` — name, email, phone, location, url, profiles (LinkedIn, etc.)
- `work` — array of work experience entries with name, position, startDate, endDate, highlights
- `education` — array of education entries
- `skills` — array of skill categories with name and keywords
- `certificates` — certifications
- `awards` — awards
- `publications` — publications
- `projects` — projects
- `volunteer` — volunteer work
- `languages` — languages

### Cover Letter Context

Save cover letter preferences and context to `.resume-craft/cover-letter-profile.json` with this structure:

```json
{
  "preferredTone": "conversational",
  "personalStories": "...",
  "careerMotivations": "...",
  "uniquePerspectives": "..."
}
```

### Directory Creation

Create the `.resume-craft/` directory if it does not already exist. Use `mkdir -p .resume-craft/` before writing any files.

---

## Update Mode

If `.resume-craft/profile.json` already exists when the user invokes this skill:

1. Read the existing profile file.
2. Present a clear summary of what is currently stored, organized by section:
   - Basics: name, email, location
   - Work Experience: list of roles (title at company, dates)
   - Education: list of degrees
   - Skills: category counts
   - Optional sections: what exists
3. Ask: "Which sections would you like to update?" Present as a multiple-choice list.
4. Walk through ONLY the selected sections using the same Q&A flow above.
5. Preserve all non-selected sections exactly as they are. Do not modify data the user did not ask to change.
6. Write the updated profile back to the same file path.

If the cover letter profile also exists, offer to update it as well after the main profile update is complete.

---

## Validation Before Saving

Before writing the profile file, verify:

- Name is not empty
- Email format is valid
- At least one work experience entry exists (or the user explicitly confirms they have no work experience)
- Each work experience entry has at least a title, company, and start date
- At least some skills are listed

If any validation fails, ask the user to provide the missing information before saving. Do not save an incomplete profile.
