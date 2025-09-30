import { Github } from "../icons";

export function WelcomeScreen() {
  return (
    <div className="text-center p-8 mt-16">
      <Github className="mx-auto h-24 w-24 text-gray-300 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800">GitHub Repository Explorer</h2>
      <p className="mt-2 text-gray-500">
        Enter a GitHub username above to start exploring their public repositories.
      </p>
    </div>
  );
}
