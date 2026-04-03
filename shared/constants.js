const CONTENT_TYPES = [
  { value: "prompt", label: "Prompt" },
  { value: "skill", label: "Skill" },
];

const SKILL_PROVIDERS = [
  { value: "claude", label: "Claude" },
  { value: "codex", label: "Codex" },
];

const CATEGORIES = [
  {
    value: "coding",
    label: "Coding",
    description: "Prompts and skills for writing, reviewing, and improving code.",
    useCases: ["code-generation", "code-review", "bug-fixing", "refactoring"],
  },
  {
    value: "writing",
    label: "Writing",
    description: "Prompts and skills for drafting, editing, and improving text.",
    useCases: ["blog-posts", "copywriting", "editing", "summarization"],
  },
  {
    value: "data",
    label: "Data",
    description: "Prompts and skills for data analysis, transformation, and visualization.",
    useCases: ["data-analysis", "data-cleaning", "visualization", "reporting"],
  },
  {
    value: "productivity",
    label: "Productivity",
    description: "Prompts and skills for task management, planning, and workflows.",
    useCases: ["planning", "automation", "organization", "decision-making"],
  },
  {
    value: "creative",
    label: "Creative",
    description: "Prompts and skills for brainstorming, design, and creative projects.",
    useCases: ["brainstorming", "storytelling", "design", "ideation"],
  },
  {
    value: "research",
    label: "Research",
    description: "Prompts and skills for exploring topics, gathering insights, and learning.",
    useCases: ["literature-review", "fact-checking", "exploration", "comparison"],
  },
  {
    value: "communication",
    label: "Communication",
    description: "Prompts and skills for emails, messages, and professional communication.",
    useCases: ["email-drafting", "presentations", "feedback", "negotiation"],
  },
  {
    value: "debugging",
    label: "Debugging",
    description: "Prompts and skills for identifying and fixing issues.",
    useCases: ["code-review", "bug-fixing", "error-analysis", "troubleshooting"],
  },
];

const TAGS = [
  { value: "beginner", label: "Beginner" },
  { value: "advanced", label: "Advanced" },
  { value: "gpt", label: "GPT" },
  { value: "claude", label: "Claude" },
  { value: "codex", label: "Codex" },
  { value: "automation", label: "Automation" },
  { value: "template", label: "Template" },
  { value: "chain-of-thought", label: "Chain of Thought" },
  { value: "few-shot", label: "Few Shot" },
  { value: "zero-shot", label: "Zero Shot" },
  { value: "system-prompt", label: "System Prompt" },
  { value: "agent", label: "Agent" },
  { value: "rag", label: "RAG" },
  { value: "fine-tuning", label: "Fine Tuning" },
];

const USE_CASES = [
  { value: "code-generation", label: "Code Generation" },
  { value: "code-review", label: "Code Review" },
  { value: "bug-fixing", label: "Bug Fixing" },
  { value: "refactoring", label: "Refactoring" },
  { value: "blog-posts", label: "Blog Posts" },
  { value: "copywriting", label: "Copywriting" },
  { value: "editing", label: "Editing" },
  { value: "summarization", label: "Summarization" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "data-cleaning", label: "Data Cleaning" },
  { value: "visualization", label: "Visualization" },
  { value: "reporting", label: "Reporting" },
  { value: "planning", label: "Planning" },
  { value: "automation", label: "Automation" },
  { value: "organization", label: "Organization" },
  { value: "decision-making", label: "Decision Making" },
  { value: "brainstorming", label: "Brainstorming" },
  { value: "storytelling", label: "Storytelling" },
  { value: "design", label: "Design" },
  { value: "ideation", label: "Ideation" },
  { value: "literature-review", label: "Literature Review" },
  { value: "fact-checking", label: "Fact Checking" },
  { value: "exploration", label: "Exploration" },
  { value: "comparison", label: "Comparison" },
  { value: "email-drafting", label: "Email Drafting" },
  { value: "presentations", label: "Presentations" },
  { value: "feedback", label: "Feedback" },
  { value: "negotiation", label: "Negotiation" },
  { value: "error-analysis", label: "Error Analysis" },
  { value: "troubleshooting", label: "Troubleshooting" },
];

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const ROLES = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "upvotes", label: "Most Upvoted" },
];

// Flat value arrays for validation
const CONTENT_TYPE_VALUES = CONTENT_TYPES.map((t) => t.value);
const SKILL_PROVIDER_VALUES = SKILL_PROVIDERS.map((p) => p.value);
const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);
const TAG_VALUES = TAGS.map((t) => t.value);
const USE_CASE_VALUES = USE_CASES.map((u) => u.value);
const VISIBILITY_VALUES = VISIBILITY_OPTIONS.map((v) => v.value);
const ROLE_VALUES = ROLES.map((r) => r.value);
const SORT_VALUES = SORT_OPTIONS.map((s) => s.value);

module.exports = {
  CONTENT_TYPES,
  SKILL_PROVIDERS,
  CATEGORIES,
  TAGS,
  USE_CASES,
  VISIBILITY_OPTIONS,
  ROLES,
  SORT_OPTIONS,
  CONTENT_TYPE_VALUES,
  SKILL_PROVIDER_VALUES,
  CATEGORY_VALUES,
  TAG_VALUES,
  USE_CASE_VALUES,
  VISIBILITY_VALUES,
  ROLE_VALUES,
  SORT_VALUES,
};
