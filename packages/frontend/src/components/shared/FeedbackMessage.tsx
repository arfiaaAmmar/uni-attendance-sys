import { FeedbackProps } from "shared-library/dist/types";

export function FeedbackMessage({ success, error }: FeedbackProps) {
  return (
    <>
      {error ? (
        <p className="text-red-500 font-bold">{error}</p>
      ) : success ? (
        <p className="text-green-600 font-bold">{success}</p>
      ) : null}
    </>
  );
}
