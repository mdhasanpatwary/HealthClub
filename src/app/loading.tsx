export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 space-y-4">
      {/* Animated Pulse Ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 dark:border-t-emerald-400 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping" />
      </div>

      <div className="space-y-1.5 text-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide animate-pulse">
          লোড হচ্ছে... (Loading Health Club)
        </p>
      </div>
    </div>
  );
}
