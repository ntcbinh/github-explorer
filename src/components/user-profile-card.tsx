import { useState, useCallback } from "react";
import { ExternalLink, Sparkles, LoaderCircle } from "../icons";
import { ErrorDisplay } from "./error-display";
import { ERROR_MESSAGES, STATUS } from "../constants";
import { AiInsightDisplay } from "./ai-insight-display";
import type { AiSummaryState, UserProfileCardProps } from "../interfaces";
import { fetchGeminiInsight } from "../api/gemini";

export const UserProfileCard = ({ user, repos }: UserProfileCardProps) => {
  const [aiSummary, setAiSummary] = useState<AiSummaryState>({
    status: STATUS.IDLE,
    data: null,
    error: null,
  });

  const handleGenerateAiSummary = useCallback(async () => {
    setAiSummary({ status: STATUS.LOADING, data: null, error: null });

    try {
      const insight = await fetchGeminiInsight(user, repos);
      setAiSummary({ status: STATUS.SUCCESS, data: insight, error: null });
    } catch (err) {
      console.error("AI Summary Error:", err);
      setAiSummary({
        status: STATUS.ERROR,
        data: null,
        error: err instanceof Error ? err.message : ERROR_MESSAGES.AI_GENERATION_ERROR,
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
