import { ServerCrash } from "../icons";

export function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 p-6 rounded-lg border border-red-200 mt-6">
      <ServerCrash className="h-12 w-12 mb-4" />
      <p className="text-lg font-bold">An Error Occurred</p>
      <p className="text-center">{message}</p>
    </div>
  );
}
