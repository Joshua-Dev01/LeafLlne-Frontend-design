// src/pages/Dashboard/Notes/NotesFiles/components/NotesTableSkeleton.tsx
import { Skeleton } from "../../../../../components/ui/skeleton";

export default function NotesTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-purple-900/30 bg-white dark:bg-black overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-purple-900/30 text-left">
            <th className="w-10 py-3 pl-5">
              <Skeleton className="w-4 h-4 rounded" />
            </th>
            <th className="py-3 px-3">
              <Skeleton className="h-3 w-24 rounded" />
            </th>
            <th className="py-3 px-3 hidden md:table-cell">
              <Skeleton className="h-3 w-16 rounded" />
            </th>
            <th className="py-3 px-3 hidden lg:table-cell">
              <Skeleton className="h-3 w-14 rounded" />
            </th>
            <th className="py-3 px-3 hidden sm:table-cell">
              <Skeleton className="h-3 w-20 rounded" />
            </th>
            <th className="py-3 pr-5" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="border-b last:border-b-0 border-neutral-100 dark:border-purple-900/20"
            >
              <td className="py-4 pl-5">
                <Skeleton className="w-4 h-4 rounded" />
              </td>

              <td className="py-4 px-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 flex-shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2 py-0.5">
                    <Skeleton className="h-3.5 rounded" style={{ width: `${55 + ((i * 13) % 30)}%` }} />
                    <Skeleton className="h-3 w-4/5 rounded" />
                  </div>
                </div>
              </td>

              <td className="py-4 px-3 hidden md:table-cell align-top">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-10 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </td>

              <td className="py-4 px-3 hidden lg:table-cell align-top">
                <div className="flex gap-1.5">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
              </td>

              <td className="py-4 px-3 hidden sm:table-cell align-top">
                <Skeleton className="h-3 w-16 rounded" />
              </td>

              <td className="py-4 pr-5 text-right align-top">
                <Skeleton className="w-7 h-7 rounded-full ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}