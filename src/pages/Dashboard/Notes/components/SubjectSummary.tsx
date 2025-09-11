import { Skeleton } from "antd";
import type { SubjectsSummaryProps } from "../types/Note";
import AddSubjectModal from "./AddSubjects/AddSubjects";

const SubjectsSummary: React.FC<SubjectsSummaryProps> = ({
  totalCourses,
  totalUnits,
  loading = false,
}) => {
  return (
    <div className=" mb-6 gap-5 p-5 bg-[#1f1f1f] rounded-2xl shadow text-white">
      <div className="flex justify-between flex-wrap gap-7">
        <div className="">
          <p className="text-2xl font-bold mb-2 text-white">
            Subjects Overview
          </p>
          <p className="text-gray-300 mb-1">
            Summary of your courses and units
          </p>

          <div className="flex flex-wrap gap-4 mt-3 text-gray-200 text-sm">
            {loading ? (
              <Skeleton className="h-7 w-32 rounded-full" />
            ) : (
              <span className="bg-blue-950 px-3 py-1 rounded-full">
                Total Courses: {totalCourses}
              </span>
            )}

            {loading ? (
              <Skeleton className="h-7 w-32 rounded-full" />
            ) : (
              <span className="bg-red-950 px-3 py-1 rounded-full">
                Total Units: {totalUnits}
              </span>
            )}
          </div>
        </div>
        <div>
          <AddSubjectModal />
        </div>
      </div>
    </div>
  );
};

export default SubjectsSummary;
