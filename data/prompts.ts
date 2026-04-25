import type { Prompt } from "@/types"

export const PROMPTS: Prompt[] = [
  {
    id: "prompt-agency-niche-research",
    title: "Agency Niche Lead Research",
    category: "Lead Research",
    linkedToolId: "perplexity",
    linkedWorkflowId: "agency-lead-generation",
    content:
      "Find 15 small-to-mid-sized businesses in Hamburg that likely need web or conversion improvements. Focus on service businesses with outdated websites, weak mobile UX, slow pages, unclear offers, or poor booking/contact flow. Return a table with company name, website, niche, likely pain point, and why they are a strong outreach target.",
  },
  {
    id: "prompt-agency-outreach-hooks",
    title: "Agency Outreach Hook Draft",
    category: "Outreach",
    linkedToolId: "chatgpt",
    linkedWorkflowId: "agency-lead-generation",
    content:
      "Using the lead notes below, write 5 short outreach hooks for a web agency offer. Each hook should mention one concrete website or funnel issue, sound human, and lead naturally into a brief offer for help. Keep each hook under 60 words and avoid generic AI phrasing.\n\nLead notes:\n[PASTE LEAD NOTES]",
  },
  {
    id: "prompt-job-role-scoring",
    title: "High-Fit Role Scoring",
    category: "Job Search",
    linkedToolId: "perplexity",
    linkedWorkflowId: "high-fit-job-discovery",
    content:
      "Find current openings for product, growth, or AI operations roles that match this profile: strong product sense, technical fluency, execution-heavy work, and small fast-moving teams. Prioritize Europe-friendly remote roles. For each role, score fit from 1-10 and explain the score in one sentence.",
  },
  {
    id: "prompt-job-application-angle",
    title: "Application Angle Builder",
    category: "Job Search",
    linkedToolId: "chatgpt",
    linkedWorkflowId: "high-fit-job-discovery",
    content:
      "Based on the job description and my background, give me 3 specific angles for why I am a strong fit. Each angle should be concrete, evidence-based, and easy to reuse in a resume summary, cover note, or recruiter message.\n\nJob description:\n[PASTE JD]\n\nMy background:\n[PASTE PROFILE]",
  },
  {
    id: "prompt-case-study-extract",
    title: "Case Study Signal Extraction",
    category: "Product Building",
    linkedToolId: "chatgpt",
    linkedWorkflowId: "product-case-study-extraction",
    content:
      "Turn the raw project notes below into a sharp case study outline with these sections: problem, constraints, approach, key decisions, shipped outcome, measurable result, and what this proves about the builder. Keep it practical and portfolio-ready.\n\nRaw notes:\n[PASTE NOTES]",
  },
  {
    id: "prompt-case-study-proof",
    title: "Proof and Metrics Pull",
    category: "Product Building",
    linkedToolId: "github",
    linkedWorkflowId: "product-case-study-extraction",
    content:
      "Review the project artifacts below and list the strongest proof points for a case study. Focus on shipped scope, visible quality, quantified outcomes, speed, and decision quality. Output 5 bullet points that can be quoted directly in a portfolio write-up.\n\nArtifacts:\n[PASTE LINKS OR NOTES]",
  },
  {
    id: "prompt-income-review",
    title: "Weekly Income Engine Review",
    category: "Review",
    linkedToolId: "obsidian",
    linkedWorkflowId: "weekly-income-engine-review",
    content:
      "Review this week's outputs across Web Agency, Job Search, Product Building, and Trading Systems. Summarize what created leverage, what stalled, what deserves less attention, and the single highest-value focus for next week. End with 3 concrete workflow commitments.",
  },
  {
    id: "prompt-trading-review",
    title: "Trading Review Debrief",
    category: "Trading",
    linkedToolId: "chatgpt",
    linkedWorkflowId: "trading-review",
    content:
      "Review the trade notes below and identify whether the trade followed the system, what emotional or timing errors showed up, and the one lesson that should change my next decision. Keep the output short, direct, and rule-focused.\n\nTrade notes:\n[PASTE TRADE NOTES]",
  },
  {
    id: "prompt-learning-compression",
    title: "Learning Sprint Compression",
    category: "Learning",
    linkedToolId: "perplexity",
    linkedWorkflowId: "learning-sprint-compression",
    content:
      "Compress the topic below into a practical 90-minute learning sprint. Return the top concepts to learn, the minimum set of sources, one practice exercise, and one output I can create today that proves I understand the topic.\n\nTopic:\n[PASTE TOPIC]",
  },
]
