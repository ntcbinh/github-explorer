import React from "react";
import { Search } from "../icons";
import type { SortOption } from "../constants";

interface RepoFilterControlsProps {
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: string) => void;
  filterQuery: string;
}

export const RepoFilterControls = React.memo<RepoFilterControlsProps>(
  ({ onSortChange, onFilterChange, filterQuery }) => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Find a repository..."
            value={filterQuery}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter repositories"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <select
          defaultValue="stars"
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          aria-label="Sort repositories by"
        >
          <option value="stars">Sort by Stars</option>
          <option value="forks">Sort by Forks</option>
          <option value="updated">Sort by Last Updated</option>
        </select>
      </div>
    );
  },
);
