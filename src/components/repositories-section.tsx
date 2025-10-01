import React, { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "../icons";
import { RepoFilterControls } from "./repo-filter-controls";
import { RepoListItem } from "./repo-list-item";
import { useDebounce } from "../hooks/use-debounce";
import { API_CONFIG, SORT_OPTIONS, type SortOption } from "../constants";
import type { RepositoriesSectionProps } from "../interfaces";
import {
  filterReposByName,
  sortRepos,
  paginateRepos,
  calcTotalPages,
} from "../helpers/repo.helper";

export const RepositoriesSection = React.memo<RepositoriesSectionProps>(({ repos }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS.STARS);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedFilterQuery = useDebounce(filterQuery, API_CONFIG.FILTER_DEBOUNCE_DELAY);

  const filteredAndSortedRepos = useMemo(() => {
    const filtered = filterReposByName(repos, debouncedFilterQuery);
    return sortRepos(filtered, sortOption);
  }, [repos, debouncedFilterQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilterQuery, sortOption]);

  const paginatedRepos = useMemo(() => {
    return paginateRepos(filteredAndSortedRepos, currentPage, API_CONFIG.REPOS_DISPLAY_PER_PAGE);
  }, [filteredAndSortedRepos, currentPage]);

  const totalPages = calcTotalPages(
    filteredAndSortedRepos.length,
    API_CONFIG.REPOS_DISPLAY_PER_PAGE,
  );

  const handleSortChange = useCallback((value: SortOption) => {
    setSortOption(value);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterQuery(value);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  if (repos.length === 0) {
    return (
      <div className="bg-white p-6 text-center text-gray-500 rounded-xl shadow-lg border border-gray-200">
        This user has no public repositories.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4">
        Repositories ({filteredAndSortedRepos.length.toLocaleString()})
      </h3>
      <RepoFilterControls
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        filterQuery={filterQuery}
        sortValue={sortOption}
      />
      <ul className="space-y-4" role="list">
        {paginatedRepos.map((repo) => (
          <RepoListItem key={repo.id} repo={repo} />
        ))}
      </ul>
      {totalPages > 1 && (
        <nav
          className="flex justify-between items-center mt-6 pt-4 border-t"
          aria-label="Repository pagination"
        >
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            aria-label="Go to previous page"
          >
            <ChevronLeft size={16} aria-hidden="true" /> Previous
          </button>
          <span className="text-sm font-medium" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            aria-label="Go to next page"
          >
            Next <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
});
