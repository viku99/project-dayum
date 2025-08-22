"use client";

import dynamic from "next/dynamic";
import type { FC, ReactNode } from "react";

/* -------------------------------
   Dynamic Import (SSR disabled)
-------------------------------- */
const StoryReaderClient = dynamic(() => import("./StoryReaderClient"), {
  ssr: false,
  loading: () => <LoadingState message="Preparing your story…" />,
});

/* -------------------------------
   Loading Skeleton
-------------------------------- */
const LoadingState: FC<{ message?: string }> = ({ message = "Loading…" }) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    className="min-h-[80vh] flex items-center justify-center bg-neutral-950 text-white"
  >
    <div className="flex flex-col items-center gap-3">
      {/* Spinner */}
      <div
        className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white"
        aria-hidden="true"
      />
      {/* Message */}
      <span className="animate-pulse text-white/70 text-lg">{message}</span>
    </div>
  </div>
);

/* -------------------------------
   Error State
-------------------------------- */
const ErrorState: FC<{ error?: string; reset?: () => void }> = ({
  error,
  reset,
}) => (
  <div
    role="alert"
    className="min-h-[80vh] flex items-center justify-center bg-red-950 text-red-100"
  >
    <div className="p-6 rounded-xl bg-red-900/60 shadow-lg max-w-md text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm mt-2">{error ?? "Unable to load story."}</p>

      {reset && (
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-sm font-medium transition"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

/* -------------------------------
   Props
-------------------------------- */
interface StoryReaderWrapperProps {
  slug: string; // required story slug
  fallback?: ReactNode; // external fallback if provided
  onError?: (error: unknown) => void; // external error handler
}

/* -------------------------------
   Wrapper Component
-------------------------------- */
const StoryReaderWrapper: FC<StoryReaderWrapperProps> = ({
  slug,
  fallback,
  onError,
}) => {
  try {
    if (!slug || slug.trim().length === 0) {
      throw new Error("Invalid story slug provided");
    }

    return <StoryReaderClient slug={slug} />;
  } catch (error) {
    if (onError) onError(error);

    // Use external fallback OR internal ErrorState
    return (
      fallback ?? <ErrorState error={(error as Error).message} reset={() => location.reload()} />
    );
  }
};

export default StoryReaderWrapper;
