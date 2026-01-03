import { Skeleton } from "../../../../components/ui/skeleton";
import type { SubjectsSummaryProps } from "../types/Note";
import AddSubjectModal from "./AddSubjects/AddSubjects";

const SubjectsSummary: React.FC<SubjectsSummaryProps> = ({
  totalCourses,
  totalUnits,
  loading = false,
}) => {
  return (
    <div className="mb-6 gap-5 p-6 rounded-2xl shadow-xl dark:bg-white/5 backdrop-blur-md border border-white/10 dark:text-black bg-white">
      <div className="flex justify-between flex-wrap gap-7 text-dark dark:text-white">
        {/* Left Section */}
        <div>
          <p className="text-2xl font-semiabold mb-2  tracking-wide ">
            Subjects Overview ✨
          </p>
          <p className="text-gray-400 mb-4 text-sm">
            Keep track of your academic progress
          </p>

          <div className="flex  gap-2 mt-2 text-sm">
            {loading ? (
              <Skeleton className="h-5 w-40 rounded-xl" />
            ) : (
              <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/40 text-white font-medium hover:scale-105 transition">
                🎓 Total Courses: {totalCourses}
              </div>
            )}

            {loading ? (
              <Skeleton className="h-5 w-40 rounded-xl" />
            ) : (
              <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-700 shadow-lg shadow-red-900/40 text-white font-medium hover:scale-105 transition">
                📚 Total Units: {totalUnits}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center">
          <AddSubjectModal />
        </div>
      </div>

      {/* Subtle divider */}
      <div className="mt-5 border-t border-white/10"></div>

      {/* Footer note */}
      <p className="mt-3 text-xs text-gray-400 italic">
        Stay consistent 📈 — every subject adds up to your success.
      </p>
    </div>
  );
};

export default SubjectsSummary;
