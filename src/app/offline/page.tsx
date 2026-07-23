"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 17.657a9 9 0 010-12.728M9.172 15.536a5 5 0 010-7.072M12 12h.01"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">ইন্টারনেট সংযোগ নেই</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            আপনি অফলাইনে আছেন। ইন্টারনেট সংযোগ চালু করুন এবং পুনরায় চেষ্টা করুন।
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            You&apos;re offline. Please check your connection and try again.
          </p>
        </div>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          পুনরায় চেষ্টা করুন · Retry
        </button>
      </div>
    </div>
  );
}
