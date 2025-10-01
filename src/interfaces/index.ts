import type { SortOption, Status } from "../constants";
import type { GitHubRepo, GitHubUser } from "../types/github";

export interface UserProfileCardProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}

export interface AiSummaryData {
  mainExpertise: string;
  keyTechnologies: {
    languages: string[];
    frameworksAndLibraries: string[];
    concepts: string[];
  };
  potentialStrengths: string[];
}

export interface AiSummaryState {
  status: Status;
  data: AiSummaryData | null;
  error: string | null;
}

export interface SelectItem {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  items?: SelectItem[];
}

export interface RepoFilterControlsProps {
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: string) => void;
  filterQuery: string;
  sortValue?: SortOption;
  options?: { value: SortOption; label: string }[];
}

export interface RepoListItemProps {
  repo: GitHubRepo;
}

export interface RepositoriesSectionProps {
  repos: GitHubRepo[];
}

export interface SearchFormProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
  initialValue?: string;
}
