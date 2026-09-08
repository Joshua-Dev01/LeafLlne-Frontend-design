import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MoreHorizontal, BookOpen, Hash, Layers } from "lucide-react";
import { Link } from "react-router-dom";

import { getSubjects } from "../api/subject.api";
import type { Subject } from "../types/Note";
import { Skeleton } from "../../../../components/ui/skeleton";
import LoadingError from "../../../../components/errors/LoadingError";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import SubjectsSummary from "./SubjectSummary";
import DeleteSubject from "./delete/DeleteSubject";
import EditSubject from "./edit/EditSubject";
import { RiDeleteBin4Fill, RiTableView } from "react-icons/ri";
import { EmptyState } from "../../../../components/Empty/EmptyState";

const SubjectsList = () => {
  const { data, isLoading, isError, refetch } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  // Modal states
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  // Calculate totals safely
  const totalCourses = data?.length || 0;
  const totalUnits =
    data?.reduce((acc, subject) => acc + Number(subject.unit || 0), 0) || 0;

  return (
    <div className="dark:text-black">
      {/* ✅ Always visible Summary Section */}
      <SubjectsSummary
        totalCourses={totalCourses}
        totalUnits={totalUnits}
        loading={isLoading}
      />

      {/* ✅ Data area (changes based on API state) */}
      {isError ? (
        <div className="mt-6">
          <LoadingError onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className=" p-6 rounded-2xl shadow space-y-3 dark:bg-none"
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </motion.div>
      ) : data?.length === 0 ? (
        <div className="flex justify-center items-center py-10 !text-white">
          <EmptyState />
        </div>
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
              className="relative bg-white dark:bg-gradient-to-br dark:from-[#1e293b] dark:to-[#0f172a]  p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              {/* Dropdown Menu */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full dark:bg-white/5 dark:hover:bg-white/10 transition shadow-md">
                      <MoreHorizontal className="w-5 h-5 dark:text-gray-300 cursor-pointer" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl bg-white overflow-hidden border dark:border-white/10 shadow-xl  
                  dark:bg-gradient-to-br dark:from-[#1e293b] dark:to-[#0f172a] 
                 "
                  >
                    <DropdownMenuItem
                      className="flex items-center gap-2 px-4 py-2 text-sm dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-white dark:hover:text-black hover:text-white cursor-pointer transition"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setEditOpen(true);
                      }}
                    >
                      ✏️ Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="flex items-center gap-2 px-4 py-2 text-sm dark:text-gray-200 hover:bg-red-600 dark:hover:bg-white dark:hover:text-black hover:text-white cursor-pointer transition"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setDeleteOpen(true);
                      }}
                    >
                      <RiDeleteBin4Fill className="text-red-500" /> Delete
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 text-sm dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-white dark:hover:text-black hover:text-white cursor-pointer transition">
                      <Link
                        to={`/dashboard/notes/viewNotes/${subject._id}`}
                        className="flex gap-2 items-center"
                      >
                        <RiTableView className="text-blue-400" /> View Notes
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Subject Name */}
              <p className="dark:text-white text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                {subject.name}
              </p>

              {/* Subject Details */}
              <div className="space-y-2 text-sm">
                <p className="dark:text-gray-200 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-700" />
                  <span className="font-medium">Code:</span> {subject.code}
                </p>
                <p className="dark:text-gray-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Units:</span> {subject.unit}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <p className="dark:text-gray-400 text-sm mb-1 font-medium">
                  Progress
                </p>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs dark:text-gray-400 mt-1">
                  {subject.progress}% complete
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ✅ Modals */}
      {selectedSubject && (
        <>
          <EditSubject
            open={isEditOpen}
            onClose={() => setEditOpen(false)}
            subject={selectedSubject}
          />

          <DeleteSubject
            open={isDeleteOpen}
            onClose={() => setDeleteOpen(false)}
            subject={selectedSubject}
          />
        </>
      )}
    </div>
  );
};

export default SubjectsList;