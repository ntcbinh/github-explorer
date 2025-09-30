// API Configuration
export const API_CONFIG = {
  REPOS_PER_PAGE: 100,
  DEBOUNCE_DELAY: 500,
  FILTER_DEBOUNCE_DELAY: 300,
  REPOS_DISPLAY_PER_PAGE: 10,
} as const;

export const HTTP_STATUS_CODE = {
  NOT_FOUND: 404,
  FORBIDDEN: 403,
};

// UI Constants
export const UI_CONFIG = {
  MAX_USERNAME_LENGTH: 39, // GitHub username limit
  MIN_SEARCH_LENGTH: 1,
} as const;

// Messages
export const MESSAGES = {
  DEFAULT_LOADING: "Fetching data...",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: (username: string) => `User '${username}' not found.`,
  RATE_LIMIT_EXCEEDED: "API rate limit exceeded. Please try again later.",
  FETCH_USER_ERROR: "Could not fetch user data.",
  FETCH_REPOS_ERROR: "Could not fetch repositories.",
  MISSING_API_KEY: "Missing Gemini Api Key",
  AI_GENERATION_ERROR: "Could not create AI analysis. Please try again.",
  NO_SUMMARY_GENERATED: "No summary was generated.",
} as const;

// Status Types
export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

// Sort Options
export const SORT_OPTIONS = {
  STARS: "stars",
  FORKS: "forks",
  UPDATED: "updated",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

// Action Types for GitHub User Hook
export const GITHUB_USER_ACTIONS = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  RESET: "RESET",
} as const;

export type GitHubUserAction = (typeof GITHUB_USER_ACTIONS)[keyof typeof GITHUB_USER_ACTIONS];

export const GEMINI_CONSTS = {
  SYSTEM_PROMPT:
    "You are an expert tech talent analyst. Your goal is to provide a concise, insightful summary of a developer's profile based on their GitHub data. You must respond with only a valid JSON object that conforms to the provided schema, and nothing else.",
  USER_QUERY: `Analyze the developer profile for "{name}" (Bio: {bio}). Their top repositories are {topRepos} and their primary languages are {topLanguages}. Based on this, provide a "Developer Insight" summary. Identify their likely area of expertise, key technologies, and potential strengths.`,
};

export const SCHEMAS = {
  GEMINI_JSON_SCHEMA: {
    type: "OBJECT",
    properties: {
      mainExpertise: {
        type: "STRING",
        description: "A sentence describing the developer's main area of expertise.",
      },
      keyTechnologies: {
        type: "OBJECT",
        properties: {
          languages: { type: "ARRAY", items: { type: "STRING" } },
          frameworksAndLibraries: { type: "ARRAY", items: { type: "STRING" } },
          concepts: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
      potentialStrengths: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "A list of 3-5 potential strengths.",
      },
    },
    required: ["mainExpertise", "keyTechnologies", "potentialStrengths"],
  },
} as const;
