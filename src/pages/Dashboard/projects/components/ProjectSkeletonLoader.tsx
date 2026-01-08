import { Skeleton } from "../../../../components/ui/skeleton";

export const ProjectCardSkeleton = () => {
  return (
    <div className="p-5 space-y-4 mt-7">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};
