import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

import { getSubjects } from "../api/subject.api";
import type { Subject } from "../types/Note";
import LoadingSkeleton from "../../../../components/loading/LoadingSkeleton";
import LoadingError from "../../../../components/errors/LoadingError";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import SubjectsSummary from "./SubjectSummary";

const SubjectsList = () => {
  const { data, isLoading, isError } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  if (isError) return <LoadingError />;

  // Calculate totals (safe defaults)
  const totalCourses = data?.length || 0;
  const totalUnits =
    data?.reduce((acc, subject) => acc + Number(subject.unit || 0), 0) || 0;

  return (
    <>
      {/* Summary always rendered */}
      <SubjectsSummary
        totalCourses={totalCourses}
        totalUnits={totalUnits}
        loading={isLoading}
      />

      {/* Subjects Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {data?.map((subject) => (
            <motion.div
              key={subject._id}
              className="bg-[#2c2c2c] p-5 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition">
                      <MoreHorizontal className="w-5 h-5 text-gray-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1f1f1f] border-none shadow-lg"
                  >
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-white text-lg font-semibold mb-2">
                {subject.name}
              </p>
              <p className="text-gray-100 mb-1">
                <span className="font-medium">Code:</span> {subject.code}
              </p>
              <p className="text-gray-100 mb-1">
                <span className="font-medium">Units:</span> {subject.unit}
              </p>
              <p className="text-gray-500 mb-2">
                <span className="font-medium">Progress:</span>
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default SubjectsList;
