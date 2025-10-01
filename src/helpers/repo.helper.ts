import type { GitHubRepo } from "../types/github";
import { API_CONFIG, SORT_OPTIONS, type SortOption } from "../constants";

export function filterReposByName(repos: GitHubRepo[], query: string): GitHubRepo[] {
  const normalized = query.toLowerCase();
  return repos.filter((repo) => repo.name.toLowerCase().includes(normalized));
}

export function sortRepos(repos: GitHubRepo[], sortOption: SortOption): GitHubRepo[] {
  return [...repos].sort((a, b) => {
    switch (sortOption) {
      case SORT_OPTIONS.FORKS:
        return b.forks_count - a.forks_count;
      case SORT_OPTIONS.UPDATED:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      default:
        return b.stargazers_count - a.stargazers_count;
    }
  });
}

export function paginateRepos(
  repos: GitHubRepo[],
  page: number,
  perPage: number = API_CONFIG.REPOS_DISPLAY_PER_PAGE,
): GitHubRepo[] {
  const startIndex = (page - 1) * perPage;
  return repos.slice(startIndex, startIndex + perPage);
}

export function calcTotalPages(
  totalItems: number,
  perPage: number = API_CONFIG.REPOS_DISPLAY_PER_PAGE,
): number {
  return Math.ceil(totalItems / perPage);
}
