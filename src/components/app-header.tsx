import { Github } from "../icons";
import { SearchForm } from "./search-form";

interface AppHeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  currentUsername?: string;
}

export function AppHeader({ onSearch, isLoading, currentUsername }: AppHeaderProps) {
  return (
    <header className="bg-white shadow-sm w-full sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Github className="text-blue-600" aria-hidden="true" />
          <span>GitHub Explorer</span>
        </div>
        <SearchForm onSubmit={onSearch} isLoading={isLoading} initialValue={currentUsername} />
      </nav>
    </header>
  );
}
