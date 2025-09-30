import { useEffect, useReducer, useRef } from "react";
import type { GitHubRepo, GitHubUser } from "../types/github";
import {
  API_CONFIG,
  ERROR_MESSAGES,
  STATUS,
  GITHUB_USER_ACTIONS,
  type Status,
  HTTP_STATUS_CODE,
} from "../constants";

type State = {
  status: Status;
  user: GitHubUser | null;
  repos: GitHubRepo[];
  error: string | null;
};

type Action =
  | { type: typeof GITHUB_USER_ACTIONS.FETCH_START }
  | {
      type: typeof GITHUB_USER_ACTIONS.FETCH_SUCCESS;
      payload: { user: GitHubUser; repos: GitHubRepo[] };
    }
  | { type: typeof GITHUB_USER_ACTIONS.FETCH_ERROR; payload: string }
  | { type: typeof GITHUB_USER_ACTIONS.RESET };

const apiCache: Map<string, { user: GitHubUser; repos: GitHubRepo[] }> = new Map();

const initialState: State = {
  status: STATUS.IDLE,
  user: null,
  repos: [],
  error: null,
};

function githubReducer(state: State, action: Action): State {
  switch (action.type) {
    case GITHUB_USER_ACTIONS.FETCH_START:
      return { ...initialState, status: STATUS.LOADING };
    case GITHUB_USER_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        status: STATUS.SUCCESS,
        user: action.payload.user,
        repos: action.payload.repos,
      };
    case GITHUB_USER_ACTIONS.FETCH_ERROR:
      return { ...state, status: STATUS.ERROR, error: action.payload };
    case GITHUB_USER_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}

async function fetchAllRepos(username: string): Promise<GitHubRepo[]> {
  let allRepos: GitHubRepo[] = [];
  let page = 1;
  let reposOnPage: GitHubRepo[];

  do {
    const url = `${import.meta.env.VITE_GITHUB_BASE_URL}/users/${username}/repos?per_page=${API_CONFIG.REPOS_PER_PAGE}&page=${page}`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === HTTP_STATUS_CODE.NOT_FOUND)
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND(username));
      if (res.status === HTTP_STATUS_CODE.FORBIDDEN)
        throw new Error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
      throw new Error(ERROR_MESSAGES.FETCH_REPOS_ERROR);
    }

    reposOnPage = await res.json();
    allRepos = [...allRepos, ...reposOnPage];
    page++;
  } while (reposOnPage.length === API_CONFIG.REPOS_PER_PAGE);

  return allRepos;
}

export function useGitHubUser(username: string) {
  const [state, dispatch] = useReducer(githubReducer, initialState);
  const currentUsername = useRef(username);

  useEffect(() => {
    if (!username) {
      dispatch({ type: GITHUB_USER_ACTIONS.RESET });
      return;
    }
    const fetchData = async () => {
      currentUsername.current = username;
      dispatch({ type: GITHUB_USER_ACTIONS.FETCH_START });
      if (apiCache.has(username)) {
        dispatch({ type: GITHUB_USER_ACTIONS.FETCH_SUCCESS, payload: apiCache.get(username)! });
        return;
      }
      try {
        const userUrl = `${import.meta.env.VITE_GITHUB_BASE_URL}/users/${username}`;
        const userPromise = fetch(userUrl);
        const reposPromise = fetchAllRepos(username);
        const [userRes, reposData] = await Promise.all([userPromise, reposPromise]);

        if (!userRes.ok) {
          if (userRes.status === HTTP_STATUS_CODE.NOT_FOUND)
            throw new Error(ERROR_MESSAGES.USER_NOT_FOUND(username));
          if (userRes.status === HTTP_STATUS_CODE.FORBIDDEN)
            throw new Error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
          throw new Error(ERROR_MESSAGES.FETCH_USER_ERROR);
        }

        const userData: GitHubUser = await userRes.json();
        const dataToCache = { user: userData, repos: reposData };
        apiCache.set(username, dataToCache);
        dispatch({ type: GITHUB_USER_ACTIONS.FETCH_SUCCESS, payload: dataToCache });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        dispatch({ type: GITHUB_USER_ACTIONS.FETCH_ERROR, payload: message });
      }
    };
    fetchData();
  }, [username]);

  return state;
}
