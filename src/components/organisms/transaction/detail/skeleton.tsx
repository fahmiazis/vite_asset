function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
}

export function DetailTransactionSkeleton() {
  return (
    <section className="space-y-4 mt-4">

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-5 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-7 w-36" />
            <SkeletonBox className="h-6 w-16 rounded-full" />
            <SkeletonBox className="h-6 w-20 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
              <SkeletonBox className="h-3 w-20" />
              <SkeletonBox className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Items Card */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-5 w-12 rounded-full" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Item header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <SkeletonBox className="w-6 h-6 rounded-full" />
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-5 w-20 rounded-full" />
                </div>
                <SkeletonBox className="h-4 w-24" />
              </div>
              {/* Item body */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <SkeletonBox className="h-3 w-16" />
                      <SkeletonBox className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Flow Card */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-3 w-24" />
        </div>

        {/* Progress bar */}
        <SkeletonBox className="h-1.5 w-full rounded-full mb-5" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <SkeletonBox className="w-7 h-7 rounded-full flex-shrink-0" />
                {i < 2 && <div className="w-0.5 flex-1 mt-1 min-h-6 bg-gray-200 dark:bg-gray-700 rounded" />}
              </div>
              <div className="pb-4 flex-1 flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <SkeletonBox className="h-3 w-36" />
                  <SkeletonBox className="h-3 w-24" />
                </div>
                <SkeletonBox className="h-5 w-16 rounded-full flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
        <div className="flex gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBox className="h-3 w-16" />
              <SkeletonBox className="h-4 w-28" />
            </div>
          ))}
        </div>
        <SkeletonBox className="h-8 w-24 rounded-lg" />
      </div>

    </section>
  )
}