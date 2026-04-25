export interface Prompt {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  isFavorite: boolean
  lastUsed: string
  useCount: number
  content: string
  variables?: string[]
}

export interface Context {
  id: string
  title: string
  type: "project" | "role" | "goal" | "constraint"
  description: string
  isActive: boolean
  tags: string[]
  updatedAt: string
}

export interface Tool {
  id: string
  name: string
  description: string
  url: string
  color: string
  isPinned: boolean
  category: string
}

export const PROMPTS: Prompt[] = [
  {
    id: "p1",
    title: "Write a PRD for [feature]",
    description: "Generate a complete Product Requirements Document with user stories, acceptance criteria, and edge cases.",
    category: "Product",
    tags: ["PRD", "Strategy", "Planning"],
    isFavorite: true,
    lastUsed: "2 hours ago",
    useCount: 47,
    content: `You are a senior product manager. Write a complete PRD for the following feature: [feature]\n\nInclude:\n1. Problem statement\n2. Goals & success metrics\n3. User stories (minimum 5)\n4. Acceptance criteria\n5. Edge cases & risks\n6. Out of scope\n\nContext: [project_context]\nTarget users: [target_users]`,
    variables: ["feature", "project_context", "target_users"],
  },
  {
    id: "p2",
    title: "Debug: find all edge cases in [code]",
    description: "Systematic analysis to identify edge cases, race conditions, and potential failure points.",
    category: "Code",
    tags: ["Debug", "Analysis", "QA"],
    isFavorite: true,
    lastUsed: "5 hours ago",
    useCount: 83,
    content: `Analyze the following code and identify all edge cases, potential bugs, and failure points:\n\n[code]\n\nFor each issue found:\n1. Describe the edge case\n2. Explain why it's a problem\n3. Provide a fix\n4. Rate severity (Critical/High/Medium/Low)\n\nAlso check for: null pointer exceptions, race conditions, input validation issues, security vulnerabilities.`,
    variables: ["code"],
  },
  {
    id: "p3",
    title: "Draft investor update email",
    description: "Professional monthly investor update with metrics, milestones, and asks.",
    category: "Business",
    tags: ["Email", "Investors", "Comms"],
    isFavorite: false,
    lastUsed: "1 day ago",
    useCount: 12,
    content: `Write a professional investor update email for [month].\n\nMetrics this month:\n- MRR: [mrr]\n- Growth: [growth]%\n- Key wins: [wins]\n- Challenges: [challenges]\n\nTone: confident, transparent, concise. Length: under 400 words. End with a clear ask or update on next milestone.`,
    variables: ["month", "mrr", "growth", "wins", "challenges"],
  },
  {
    id: "p4",
    title: "Create user story with acceptance criteria",
    description: "Structured user story in As a / I want / So that format with BDD-style acceptance criteria.",
    category: "Product",
    tags: ["Agile", "User Story", "BDD"],
    isFavorite: false,
    lastUsed: "3 hours ago",
    useCount: 61,
    content: `Create a user story for the following feature: [feature_description]\n\nFormat:\nAs a [user_type], I want to [action], so that [benefit].\n\nAcceptance Criteria (Given/When/Then):\n- Scenario 1: ...\n- Scenario 2: ...\n- Scenario 3: ...\n\nDefinition of Done:\n- [ ] ...\n\nEdge cases to consider:\n- ...`,
    variables: ["feature_description", "user_type"],
  },
  {
    id: "p5",
    title: "Market positioning analysis for [company]",
    description: "Competitive landscape analysis with positioning map, differentiation strategy, and GTM insights.",
    category: "Business",
    tags: ["Research", "Strategy", "GTM"],
    isFavorite: true,
    lastUsed: "2 days ago",
    useCount: 19,
    content: `Conduct a market positioning analysis for: [company]\n\nProduct/Service: [product_description]\nTarget market: [target_market]\n\nAnalyze:\n1. Top 5 competitors with their positioning\n2. Market gaps and opportunities\n3. Unique differentiators\n4. Recommended positioning statement\n5. Key messaging pillars\n6. Go-to-market strategy recommendations`,
    variables: ["company", "product_description", "target_market"],
  },
  {
    id: "p6",
    title: "Refactor [code] to use [pattern]",
    description: "Transform existing code to follow a specific design pattern while maintaining functionality.",
    category: "Code",
    tags: ["Refactor", "Architecture", "Clean Code"],
    isFavorite: false,
    lastUsed: "6 hours ago",
    useCount: 34,
    content: `Refactor the following code to use the [pattern] pattern:\n\n[code]\n\nRequirements:\n1. Maintain all existing functionality\n2. Improve readability and maintainability\n3. Add relevant comments\n4. Show before/after comparison\n5. Explain the benefits of this pattern in this context\n\nLanguage/Framework: [language]`,
    variables: ["code", "pattern", "language"],
  },
  {
    id: "p7",
    title: "Generate 10 naming options for [concept]",
    description: "Creative naming brainstorm with rationale, domain availability tips, and brand alignment scores.",
    category: "Creative",
    tags: ["Naming", "Branding", "Creative"],
    isFavorite: false,
    lastUsed: "4 days ago",
    useCount: 8,
    content: `Generate 10 naming options for: [concept]\n\nBrand values: [values]\nTarget audience: [audience]\nStyle preference: [style] (e.g., professional, playful, technical)\n\nFor each name provide:\n- The name\n- Pronunciation guide\n- Meaning/rationale\n- Domain availability likelihood\n- Brand alignment score (1-10)\n\nCategorize as: Descriptive / Abstract / Metaphorical / Compound`,
    variables: ["concept", "values", "audience", "style"],
  },
  {
    id: "p8",
    title: "Write SEO-optimized meta description",
    description: "Craft compelling meta descriptions under 160 chars that drive click-through rates.",
    category: "Marketing",
    tags: ["SEO", "Copywriting", "Marketing"],
    isFavorite: false,
    lastUsed: "1 day ago",
    useCount: 27,
    content: `Write 5 SEO-optimized meta descriptions for:\n\nPage title: [page_title]\nMain keyword: [keyword]\nTarget audience: [audience]\nValue proposition: [value_prop]\n\nRequirements:\n- Under 160 characters each\n- Include main keyword naturally\n- Strong call-to-action\n- Highlight unique value\n- No keyword stuffing\n\nAlso suggest 3 title tag variations.`,
    variables: ["page_title", "keyword", "audience", "value_prop"],
  },
  {
    id: "p9",
    title: "Summarize article in 5 bullet points",
    description: "Extract the most important insights from any article, paper, or long-form content.",
    category: "General",
    tags: ["Summary", "Research", "Reading"],
    isFavorite: false,
    lastUsed: "30 mins ago",
    useCount: 142,
    content: `Summarize the following content into exactly 5 bullet points:\n\n[content]\n\nEach bullet point should:\n- Be 1-2 sentences maximum\n- Capture a distinct key insight\n- Be written in active voice\n- Include specific data points where present\n\nAfter the bullets, add:\n- One-sentence TL;DR\n- Key action items (if applicable)\n- Questions this raises`,
    variables: ["content"],
  },
  {
    id: "p10",
    title: "Design database schema for [feature]",
    description: "PostgreSQL schema design with tables, indexes, relationships, and performance considerations.",
    category: "Code",
    tags: ["Database", "Architecture", "SQL"],
    isFavorite: true,
    lastUsed: "8 hours ago",
    useCount: 31,
    content: `Design a PostgreSQL database schema for: [feature]\n\nRequirements:\n- [requirements]\n\nProvide:\n1. Entity-relationship description\n2. CREATE TABLE statements with appropriate types and constraints\n3. Foreign key relationships\n4. Recommended indexes (with justification)\n5. Example queries for common use cases\n6. Scaling considerations\n7. Migration strategy if updating existing schema\n\nScale target: [scale_target]`,
    variables: ["feature", "requirements", "scale_target"],
  },
  {
    id: "p11",
    title: "Cold outreach email for [prospect]",
    description: "Personalized cold email that gets replies — focused on value, not features.",
    category: "Marketing",
    tags: ["Email", "Sales", "Outreach"],
    isFavorite: false,
    lastUsed: "3 days ago",
    useCount: 15,
    content: `Write a cold outreach email to [prospect_name] at [company].\n\nTheir pain point: [pain_point]\nOur solution: [solution]\nSocial proof: [proof]\n\nRules:\n- Subject line under 8 words\n- Email under 150 words\n- One clear CTA\n- No feature dumping\n- Personalized opening line\n- Value-first framing\n\nWrite 3 subject line variants with predicted open rate rationale.`,
    variables: ["prospect_name", "company", "pain_point", "solution", "proof"],
  },
  {
    id: "p12",
    title: "API endpoint documentation",
    description: "Generate OpenAPI/Swagger-style documentation from code or description.",
    category: "Code",
    tags: ["API", "Docs", "Developer"],
    isFavorite: false,
    lastUsed: "1 day ago",
    useCount: 22,
    content: `Generate API documentation for the following endpoint:\n\n[endpoint_code_or_description]\n\nInclude:\n1. Endpoint summary and description\n2. Request parameters (path, query, body)\n3. Request/response examples (JSON)\n4. Error codes and descriptions\n5. Authentication requirements\n6. Rate limits (if applicable)\n7. SDK usage examples (JavaScript and Python)\n\nFormat: OpenAPI 3.0 YAML`,
    variables: ["endpoint_code_or_description"],
  },
]

export const CONTEXTS: Context[] = [
  {
    id: "c1",
    title: "Startup MVP Phase",
    type: "project",
    description: "Early-stage SaaS product in validation phase. Target: 10 paying customers. Budget constrained. Moving fast.",
    isActive: true,
    tags: ["SaaS", "MVP", "B2B"],
    updatedAt: "Today",
  },
  {
    id: "c2",
    title: "Technical Product Manager",
    type: "role",
    description: "PM with strong engineering background. Can read code, understand system design. Bridge between product and eng.",
    isActive: true,
    tags: ["Product", "Technical", "Leadership"],
    updatedAt: "Today",
  },
  {
    id: "c3",
    title: "Reach $10k MRR by Q3",
    type: "goal",
    description: "Primary revenue milestone. Requires 20 customers at $500/mo or 10 at $1k/mo. Focus on acquisition and retention.",
    isActive: true,
    tags: ["Revenue", "Growth", "Q3"],
    updatedAt: "2 days ago",
  },
  {
    id: "c4",
    title: "No external paid APIs",
    type: "constraint",
    description: "Use only free tiers or in-house tools during MVP phase. Exception: core infrastructure (Vercel, Supabase).",
    isActive: false,
    tags: ["Budget", "Technical", "MVP"],
    updatedAt: "1 week ago",
  },
  {
    id: "c5",
    title: "B2B SaaS — AI Tooling",
    type: "project",
    description: "Building productivity tools for AI-native teams. Competitive space: Notion, Linear, Raycast. Differentiate on speed.",
    isActive: false,
    tags: ["B2B", "AI", "Productivity"],
    updatedAt: "3 days ago",
  },
  {
    id: "c6",
    title: "Solo Founder",
    type: "role",
    description: "Single-person operation. Full-stack dev + product + sales. 80/20 focus: highest leverage tasks only.",
    isActive: true,
    tags: ["Founder", "Solo", "Leverage"],
    updatedAt: "Today",
  },
  {
    id: "c7",
    title: "Ship weekly, measure daily",
    type: "goal",
    description: "Velocity goal: ship something every week. Review key metrics daily (MRR, signups, churn, support tickets).",
    isActive: false,
    tags: ["Velocity", "Metrics", "Execution"],
    updatedAt: "5 days ago",
  },
  {
    id: "c8",
    title: "Target: Technical PMsw",
    type: "constraint",
    description: "ICP is technical PMs, AI builders, and solo founders. Messaging must resonate with power users. No enterprise bloat.",
    isActive: true,
    tags: ["ICP", "Targeting", "Positioning"],
    updatedAt: "2 days ago",
  },
]

export const TOOLS: Tool[] = [
  {
    id: "t1",
    name: "ChatGPT",
    description: "OpenAI's flagship chat model — GPT-4o and o3",
    url: "https://chatgpt.com",
    color: "#10a37f",
    isPinned: true,
    category: "LLM",
  },
  {
    id: "t2",
    name: "Claude",
    description: "Anthropic's Claude — best for long-form and reasoning",
    url: "https://claude.ai",
    color: "#d97706",
    isPinned: true,
    category: "LLM",
  },
  {
    id: "t3",
    name: "Cursor",
    description: "AI-native code editor powered by Claude and GPT",
    url: "https://cursor.sh",
    color: "#7c3aed",
    isPinned: true,
    category: "Code",
  },
  {
    id: "t4",
    name: "Perplexity",
    description: "AI-powered search with real-time web access",
    url: "https://perplexity.ai",
    color: "#0ea5e9",
    isPinned: true,
    category: "Research",
  },
  {
    id: "t5",
    name: "Gemini",
    description: "Google's multimodal AI — text, code, and images",
    url: "https://gemini.google.com",
    color: "#4285f4",
    isPinned: false,
    category: "LLM",
  },
  {
    id: "t6",
    name: "Midjourney",
    description: "State-of-the-art image generation via Discord",
    url: "https://midjourney.com",
    color: "#000000",
    isPinned: false,
    category: "Image",
  },
  {
    id: "t7",
    name: "v0 by Vercel",
    description: "AI-powered UI generation for Next.js and React",
    url: "https://v0.dev",
    color: "#000000",
    isPinned: false,
    category: "Code",
  },
  {
    id: "t8",
    name: "Linear",
    description: "Issue tracking built for speed — used with AI workflows",
    url: "https://linear.app",
    color: "#5e6ad2",
    isPinned: false,
    category: "Productivity",
  },
  {
    id: "t9",
    name: "Notion AI",
    description: "AI writing assistant embedded in your knowledge base",
    url: "https://notion.so",
    color: "#000000",
    isPinned: false,
    category: "Productivity",
  },
  {
    id: "t10",
    name: "Groq",
    description: "Ultra-fast LLM inference — Llama 3 at 500+ tok/s",
    url: "https://groq.com",
    color: "#f97316",
    isPinned: false,
    category: "LLM",
  },
  {
    id: "t11",
    name: "GitHub Copilot",
    description: "AI pair programmer integrated into your IDE",
    url: "https://github.com/features/copilot",
    color: "#24292e",
    isPinned: false,
    category: "Code",
  },
  {
    id: "t12",
    name: "ElevenLabs",
    description: "AI voice cloning and text-to-speech generation",
    url: "https://elevenlabs.io",
    color: "#1a1a1a",
    isPinned: false,
    category: "Audio",
  },
]

export const CATEGORY_COLORS: Record<string, string> = {
  Code: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Product: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  Business: "bg-green-500/15 text-green-400 border border-green-500/20",
  Marketing: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  General: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
  Creative: "bg-pink-500/15 text-pink-400 border border-pink-500/20",
  Research: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
}

export const CONTEXT_TYPE_CONFIG = {
  project: { label: "Project", color: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  role: { label: "Role", color: "bg-violet-500/15 text-violet-400 border border-violet-500/20" },
  goal: { label: "Goal", color: "bg-green-500/15 text-green-400 border border-green-500/20" },
  constraint: { label: "Constraint", color: "bg-orange-500/15 text-orange-400 border border-orange-500/20" },
}
