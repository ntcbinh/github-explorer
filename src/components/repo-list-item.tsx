import React from "react";
import { GitFork, Star } from "../icons";
import type { RepoListItemProps } from "../interfaces";

export const RepoListItem = React.memo<RepoListItemProps>(({ repo }) => {
  return (
    <li className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex justify-between items-start">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-bold text-blue-700 hover:underline break-all"
          aria-label={`View ${repo.name} repository on GitHub`}
        >
          {repo.name}
        </a>
        <div className="flex items-center gap-4 text-gray-600 text-sm flex-shrink-0 ml-4">
          <span className="flex items-center gap-1" aria-label={`${repo.stargazers_count} stars`}>
            <Star size={14} aria-hidden="true" /> {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1" aria-label={`${repo.forks_count} forks`}>
            <GitFork size={14} aria-hidden="true" /> {repo.forks_count.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-gray-600 my-2 text-sm">{repo.description || "No description provided."}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        <span
          className="font-mono bg-gray-100 px-2 py-1 rounded"
          aria-label={`Primary language: ${repo.language || "Not specified"}`}
        >
          {repo.language || "N/A"}
        </span>
        <span aria-label={`Last updated: ${new Date(repo.updated_at).toLocaleDateString()}`}>
          Updated on {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
    </li>
  );
});
