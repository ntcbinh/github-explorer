import type { Status } from "../constants";
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
