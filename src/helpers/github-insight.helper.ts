import type { GitHubRepo, GitHubUser } from "../types/github";
import { GEMINI_CONSTS } from "../constants";
import { formatStringByTemplate } from "./string.helper";

export function getTopReposByStars(repos: GitHubRepo[], limit: number = 10): GitHubRepo[] {
  return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, limit);
}

export function getTopLanguages(repos: GitHubRepo[], limit: number = 5): string[] {
  const languageToCount: Record<string, number> = repos.reduce(
    (acc: Record<string, number>, repo: GitHubRepo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  return Object.entries(languageToCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([language]) => language);
}

export function buildUserQuery(user: GitHubUser, repos: GitHubRepo[]): string {
  const topRepos = getTopReposByStars(repos, 10);
  const topLanguages = getTopLanguages(repos, 5);

  return formatStringByTemplate(GEMINI_CONSTS.USER_QUERY, {
    name: user.name || user.login,
    bio: user.bio || "Not provided",
    topRepos: topRepos.map((r) => r.name).join(", "),
    topLanguages: topLanguages.join(", "),
  });
}
