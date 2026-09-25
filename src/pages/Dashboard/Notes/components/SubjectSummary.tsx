import { Skeleton } from "../../../../components/ui/skeleton";
import type { SubjectsSummaryProps } from "../types/Note";
import AddSubjectModal from "./AddSubjects/AddSubjects";
import { BookOpen, Layers, Sparkles, TrendingUp } from "lucide-react";

const SubjectsSummary: React.FC<SubjectsSummaryProps> = ({
  totalCourses,
  totalUnits,
  loading = false,
}) => {
  return (
    <div className="
      relative overflow-hidden rounded-2xl
      bg-white dark:bg-black
      border border-purple-200/60 dark:border-purple-900/40
      shadow-[0_2px_16px_rgba(88,28,135,0.06)]
      dark:shadow-[0_2px_24px_rgba(0,0,0,0.5)]
      p-6
    ">
      {/* Radial purple glow, top-right */}
      <div className="
        absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none
        bg-purple-500/10 dark:bg-purple-600/20 blur-2xl
      " />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">

        {/* ── Left ─────────────────────────────────────────────── */}
        <div>
          <span className="
            inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full
            bg-purple-50 dark:bg-purple-500/15
            text-[10px] font-semibold tracking-[0.15em] uppercase
            text-purple-700 dark:text-purple-300
          ">
            <Sparkles className="w-3 h-3" />
            Academic Overview
          </span>

          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Subjects Overview
          </h2>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-5">
            Keep track of your academic progress and enrolled units.
          </p>

          <div className="flex flex-wrap gap-3">
            {loading ? (
              <>
                <Skeleton className="h-9 w-32 rounded-full dark:bg-neutral-800" />
                <Skeleton className="h-9 w-28 rounded-full dark:bg-neutral-800" />
              </>
            ) : (
              <>
                <div className="
                  flex items-center gap-2 px-4 py-2 rounded-full
                  bg-black dark:bg-purple-500/15
                  border border-black dark:border-purple-500/30
                  transition-all duration-200 hover:-translate-y-0.5
                ">
                  <BookOpen className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" />
                  <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white dark:text-purple-200">
                    {totalCourses} {totalCourses === 1 ? "Course" : "Courses"}
                  </span>
                </div>

                <div className="
                  flex items-center gap-2 px-4 py-2 rounded-full
                  bg-purple-50 dark:bg-white/5
                  border border-purple-200 dark:border-white/10
                  transition-all duration-200 hover:-translate-y-0.5
                ">
                  <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300 flex-shrink-0" />
                  <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-purple-900 dark:text-neutral-200">
                    {totalUnits} {totalUnits === 1 ? "Unit" : "Units"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center flex-shrink-0">
          <AddSubjectModal />
        </div>
      </div>

      <div className="
        mt-5 h-px
        bg-gradient-to-r from-purple-300/40 via-purple-300/10 to-transparent
        dark:from-purple-500/30 dark:via-purple-500/10 dark:to-transparent
      " />

      <div className="mt-3 flex items-center gap-2">
        <TrendingUp className="w-3 h-3 text-purple-500 dark:text-purple-400 flex-shrink-0" />
        <p className="text-[11px] italic text-neutral-400 dark:text-neutral-500">
          Consistency is the foundation of academic excellence — every subject brings you closer.
        </p>
      </div>
    </div>
  );
};

export default SubjectsSummary;