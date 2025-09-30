import { useState, useCallback } from "react";
import { ExternalLink, Sparkles, LoaderCircle } from "../icons";
import { ErrorDisplay } from "./error-display";
import { ERROR_MESSAGES, GEMINI_CONSTS, SCHEMAS, STATUS } from "../constants";
import { AiInsightDisplay } from "./ai-insight-display";
import type { AiSummaryState, UserProfileCardProps } from "../interfaces";
import { formatStringByTemplate } from "../helpers/string.helper";

export const UserProfileCard = ({ user, repos }: UserProfileCardProps) => {
  const [aiSummary, setAiSummary] = useState<AiSummaryState>({
    status: STATUS.IDLE,
    data: null,
    error: null,
  });

  const handleGenerateAiSummary = useCallback(async () => {
    setAiSummary({ status: STATUS.LOADING, data: null, error: null });

    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);
    const languages = repos.reduce((acc: Record<string, number>, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});
    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);

    const userQuery = formatStringByTemplate(GEMINI_CONSTS.USER_QUERY, {
      name: user.name || user.login,
      bio: user.bio || "Not provided",
      topRepos: topRepos.map((r) => r.name).join(", "),
      topLanguages: topLanguages.join(", "),
    });

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setAiSummary({ status: STATUS.ERROR, data: null, error: ERROR_MESSAGES.MISSING_API_KEY });
      return;
    }

    const geminiApiUrl = import.meta.env.VITE_GEMINI_API_URL as string | undefined;
    const apiUrl = formatStringByTemplate(geminiApiUrl, { apiKey });

    try {
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: GEMINI_CONSTS.SYSTEM_PROMPT }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: SCHEMAS.GEMINI_JSON_SCHEMA,
        },
      };
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
      const data = await res.json();
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) throw new Error("Could not extract JSON from API response.");

      const parsedJson = JSON.parse(jsonText);
      setAiSummary({ status: STATUS.SUCCESS, data: parsedJson, error: null });
    } catch (err) {
      console.error("AI Summary Error:", err);
      setAiSummary({
        status: STATUS.ERROR,
        data: null,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }, [user, repos]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-28 h-28 rounded-full border-4 border-gray-200"
          />
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-blue-600 hover:underline flex items-center gap-1 justify-center md:justify-start"
            >
              @{user.login} <ExternalLink size={16} />
            </a>
            <p className="text-gray-600 mt-2">{user.bio || "No bio available."}</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4 text-sm text-gray-700">
              <span className="font-semibold">{user.followers.toLocaleString()}</span> followers ·{" "}
              <span className="font-semibold">{user.following.toLocaleString()}</span> following
            </div>
          </div>
          <button
            onClick={handleGenerateAiSummary}
            disabled={aiSummary.status === STATUS.LOADING}
            className="flex-shrink-0 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-wait"
          >
            {aiSummary.status === STATUS.LOADING ? (
              <>
                <LoaderCircle className="animate-spin h-5 w-5" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} /> AI Insight
              </>
            )}
          </button>
        </div>
      </div>

      {aiSummary.status === STATUS.ERROR && aiSummary.error && (
        <ErrorDisplay message={aiSummary.error} />
      )}
      {aiSummary.status === STATUS.SUCCESS && aiSummary.data && (
        <AiInsightDisplay insightData={aiSummary.data} />
      )}
    </div>
  );
};
