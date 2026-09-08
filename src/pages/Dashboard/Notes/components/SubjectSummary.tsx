import { Skeleton } from "../../../../components/ui/skeleton";
import type { SubjectsSummaryProps } from "../types/Note";
import AddSubjectModal from "./AddSubjects/AddSubjects";
import { BookOpen, Layers, TrendingUp } from "lucide-react";

const SubjectsSummary: React.FC<SubjectsSummaryProps> = ({
  totalCourses,
  totalUnits,
  loading = false,
}) => {
  return (
    <div className="
      relative overflow-hidden rounded-sm
      bg-white dark:bg-[#111111]
      border border-amber-200/40 dark:border-neutral-800
      border-l-[3px] border-l-amber-500
      shadow-[0_2px_16px_rgba(13,31,60,0.06)]
      dark:shadow-[0_2px_16px_rgba(0,0,0,0.4)]
      p-6
    ">
      {/* Faint radial glow top-right */}
      <div className="
        absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none
        bg-amber-400/5 dark:bg-amber-400/[0.03]
      " />

      {/* Corner bracket BR */}
      <div className="
        absolute bottom-3 right-3 w-5 h-5
        border-b border-r border-amber-400/20 dark:border-neutral-700
      " />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">

        {/* ── Left ─────────────────────────────────────────────── */}
        <div>
          {/* Section label */}
          <p className="
            text-[10px] font-semibold tracking-[0.25em] uppercase
            text-amber-600 dark:text-amber-500 mb-2
            font-['Source_Sans_3',_sans-serif]
            flex items-center gap-2
          ">
            <span className="inline-block w-4 h-px bg-amber-500" />
            Academic Overview
          </p>

          {/* Heading */}
          <h2 className="
            font-['Georgia',_serif] text-xl font-bold
            text-[#0D1F3C] dark:text-white mb-1
          ">
            Subjects Overview
          </h2>

          <p className="
            text-slate-400 dark:text-neutral-500 text-sm font-light
            font-['Source_Sans_3',_sans-serif] mb-5
          ">
            Keep track of your academic progress and enrolled units.
          </p>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-3">
            {loading ? (
              <>
                <Skeleton className="h-9 w-40 rounded-sm dark:bg-neutral-800" />
                <Skeleton className="h-9 w-36 rounded-sm dark:bg-neutral-800" />
              </>
            ) : (
              <>
                {/* Courses badge */}
                <div className="
                  flex items-center gap-2.5 px-4 py-2
                  bg-[#0D1F3C] dark:bg-[#1e293b]
                  border border-[#0D1F3C] dark:border-neutral-700
                  rounded-sm
                  transition-all duration-200 hover:-translate-y-0.5
                  hover:shadow-[0_4px_16px_rgba(13,31,60,0.2)]
                  dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]
                ">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="
                    text-[11px] font-semibold tracking-[0.12em] uppercase
                    text-amber-400 font-['Source_Sans_3',_sans-serif]
                  ">
                    {totalCourses} {totalCourses === 1 ? "Course" : "Courses"}
                  </span>
                </div>

                {/* Units badge */}
                <div className="
                  flex items-center gap-2.5 px-4 py-2
                  bg-[#F7F4EE] dark:bg-[#1b1b1b]
                  border border-amber-300/50 dark:border-neutral-700
                  rounded-sm
                  transition-all duration-200 hover:-translate-y-0.5
                  hover:shadow-[0_4px_16px_rgba(196,154,42,0.12)]
                ">
                  <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                  <span className="
                    text-[11px] font-semibold tracking-[0.12em] uppercase
                    text-[#0D1F3C] dark:text-neutral-300
                    font-['Source_Sans_3',_sans-serif]
                  ">
                    {totalUnits} {totalUnits === 1 ? "Unit" : "Units"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right ────────────────────────────────────────────── */}
        <div className="flex items-center flex-shrink-0">
          <AddSubjectModal />
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="
        mt-5 h-px
        bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-transparent
        dark:from-neutral-800 dark:via-neutral-800/50 dark:to-transparent
      " />

      {/* ── Footer note ───────────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-2">
        <TrendingUp className="w-3 h-3 text-amber-500 flex-shrink-0" />
        <p className="
          text-[11px] font-light italic
          text-slate-400 dark:text-neutral-600
          font-['Georgia',_serif]
        ">
          Consistency is the foundation of academic excellence — every subject brings you closer.
        </p>
      </div>
    </div>
  );
};

export default SubjectsSummary;