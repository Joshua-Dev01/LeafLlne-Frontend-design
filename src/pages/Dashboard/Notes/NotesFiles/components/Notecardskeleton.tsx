import { Skeleton } from "../../../../../components/ui/skeleton";

export default function NoteCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-10 h-3 rounded" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded mb-2" />
      <Skeleton className="h-4 w-1/2 rounded mb-4" />
      <Skeleton className="h-3 w-full rounded mb-1.5" />
      <Skeleton className="h-3 w-5/6 rounded mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}