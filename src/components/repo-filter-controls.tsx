import React from "react";
import { Search } from "../icons";
import { Input, Select } from ".";
import { SORT_OPTIONS, type SortOption } from "../constants";
import type { RepoFilterControlsProps } from "../interfaces";

export const RepoFilterControls = React.memo<RepoFilterControlsProps>(
  ({ onSortChange, onFilterChange, filterQuery, sortValue, options }) => {
    const fallbackOptions: { value: SortOption; label: string }[] = [
      { value: SORT_OPTIONS.STARS, label: "Sort by Stars" },
      { value: SORT_OPTIONS.FORKS, label: "Sort by Forks" },
      { value: SORT_OPTIONS.UPDATED, label: "Sort by Last Updated" },
    ];

    const renderedOptions = options && options.length > 0 ? options : fallbackOptions;

    return (
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Find a repository..."
            value={filterQuery}
            onChange={(e) => onFilterChange((e.target as HTMLInputElement).value)}
            className="pl-10"
            aria-label="Filter repositories"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <Select
          value={sortValue ?? "stars"}
          onChange={(e) => onSortChange((e.target as HTMLSelectElement).value as SortOption)}
          aria-label="Sort repositories by"
          items={renderedOptions}
        />
      </div>
    );
  },
);
