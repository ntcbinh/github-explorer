import { ERROR_MESSAGES, GEMINI_CONSTS, SCHEMAS } from "../constants";
import type { GitHubRepo, GitHubUser } from "../types/github";
import { formatStringByTemplate } from "../helpers/string.helper";
import {
  buildUserQuery,
  getTopLanguages,
  getTopReposByStars,
} from "../helpers/github-insight.helper";

export async function fetchGeminiInsight(user: GitHubUser, repos: GitHubRepo[]) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  const geminiApiUrl = import.meta.env.VITE_GEMINI_API_URL as string | undefined;
  const apiUrl = formatStringByTemplate(geminiApiUrl, { apiKey });

  const userQuery = buildUserQuery(user, repos);

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: GEMINI_CONSTS.SYSTEM_PROMPT }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCHEMAS.GEMINI_JSON_SCHEMA,
    },
  } as const;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
  const data = await res.json();
  const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
  if (!jsonText) throw new Error("Could not extract JSON from API response.");

  return JSON.parse(jsonText);
}

export const geminiUtils = {
  getTopReposByStars,
  getTopLanguages,
  buildUserQuery,
};
