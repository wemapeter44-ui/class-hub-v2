export function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse">
      <div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-slate-800 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-slate-800 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonLine({ width = 'w-full' }) {
  return (
    <div className={`h-4 bg-slate-800 rounded ${width} animate-pulse`}></div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse">
      <div className="h-3 bg-slate-800 rounded w-1/2 mb-3"></div>
      <div className="h-8 bg-slate-800 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}