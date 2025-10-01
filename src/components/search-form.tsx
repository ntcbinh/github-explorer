import React, { useState } from "react";
import { Search } from "../icons";
import { UI_CONFIG } from "../constants";
import type { SearchFormProps } from "../interfaces";

export function SearchForm({ onSubmit, isLoading, initialValue = "" }: SearchFormProps) {
  const [username, setUsername] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername.length >= UI_CONFIG.MIN_SEARCH_LENGTH) {
      onSubmit(trimmedUsername);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= UI_CONFIG.MAX_USERNAME_LENGTH) {
      setUsername(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full sm:w-auto flex items-center gap-2">
      <div className="relative w-full max-w-xs">
        <input
          name="username"
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter GitHub username"
          disabled={isLoading}
          maxLength={UI_CONFIG.MAX_USERNAME_LENGTH}
          className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="GitHub username"
          aria-describedby="username-help"
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || username.trim().length < UI_CONFIG.MIN_SEARCH_LENGTH}
        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        aria-label={isLoading ? "Searching for user" : "Search for GitHub user"}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
      <div id="username-help" className="sr-only">
        Enter a valid GitHub username to search for their repositories
      </div>
    </form>
  );
}
