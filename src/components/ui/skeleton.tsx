import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-400 dark:bg-[#3a3740] animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }