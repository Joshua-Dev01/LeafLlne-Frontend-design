import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-gray-100 dark:bg-gray-700", // light + dark
        className
      )}
      {...props}
    />
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="p-4">
     
      <Skeleton className="h-[20px] w-[100px] rounded-full" />
      
      
      <Skeleton className="h-[14px] w-[0px] mt-2" />
    </div>
  );
};

export default LoadingSkeleton;
