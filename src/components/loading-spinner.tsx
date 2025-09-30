import { LoaderCircle } from "../icons";
import { MESSAGES } from "../constants";

export function LoadingSpinner({ text = MESSAGES.DEFAULT_LOADING }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-16">
      <LoaderCircle className="animate-spin h-12 w-12 mb-4" />
      <p className="text-lg font-medium">{text}</p>
    </div>
  );
}
