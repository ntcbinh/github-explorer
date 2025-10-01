import { useState, useCallback } from "react";
import { useDebounce, useGitHubUser } from "./hooks";
import {
  AppHeader,
  ErrorDisplay,
  LoadingSpinner,
  RepositoriesSection,
  UserProfileCard,
  WelcomeScreen,
} from "./components";
import { API_CONFIG, ERROR_MESSAGES, STATUS } from "./constants";

function App() {
  const [usernameQuery, setUsernameQuery] = useState("");
  const debouncedUsername = useDebounce(usernameQuery, API_CONFIG.DEBOUNCE_DELAY);
  const { status, user, repos, error } = useGitHubUser(debouncedUsername);

  const handleSearch = useCallback((username: string) => {
    setUsernameQuery(username);
  }, []);

  const renderMainContent = useCallback(() => {
    switch (status) {
      case STATUS.IDLE:
        return <WelcomeScreen />;
      case STATUS.LOADING:
        return <LoadingSpinner />;
      case STATUS.ERROR:
        return <ErrorDisplay message={error || ERROR_MESSAGES.FETCH_USER_ERROR} />;
      case STATUS.SUCCESS:
        if (!user) return null;
        return (
          <div className="flex w-full flex-col gap-6">
            <UserProfileCard user={user} repos={repos} />
            <RepositoriesSection repos={repos} />
          </div>
        );
      default:
        return null;
    }
  }, [status, user, repos, error]);

  return (
    <div className="bg-gray-50 min-w-screen min-h-screen font-sans text-gray-800">
      <AppHeader
        onSearch={handleSearch}
        isLoading={status === STATUS.LOADING}
        currentUsername={usernameQuery}
      />
      <main className="container w-full mx-auto p-4 md:p-6">
        <div className="max-w-11/12 mx-auto">{renderMainContent()}</div>
      </main>
    </div>
  );
}

export default App;
