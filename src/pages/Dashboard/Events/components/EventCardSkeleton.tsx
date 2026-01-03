import { Skeleton } from "../../../../components/ui/skeleton";

export const EventCardSkeleton = () => {
  return (
    <div className="rounded-xl  p-4 space-y-4">
      <Skeleton className="h-40 w-full rounded-lg" />

      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
};
