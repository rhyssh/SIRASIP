export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-slate-200 rounded animate-pulse" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
        <div className="md:col-span-2 space-y-6">
          <div className="h-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-32 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
