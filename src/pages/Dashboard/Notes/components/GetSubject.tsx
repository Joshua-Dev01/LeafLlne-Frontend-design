import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  ArrowRight,
  FileText,
  Layers,
  Dna,
  Laptop2,
  Brain,
  LineChart,
  Landmark,
  FlaskConical,
  Scale,
  Ruler,
  BookOpen,
} from "lucide-react";
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
import { RiDeleteBin4Fill } from "react-icons/ri";
import { EmptyState } from "../../../../components/Empty/EmptyState";

const ICON_MAP: { match: RegExp; icon: typeof Dna }[] = [
  { match: /^BIO/i, icon: Dna },
  { match: /^(CS|COM)/i, icon: Laptop2 },
  { match: /^PSY/i, icon: Brain },
  { match: /^ECO/i, icon: LineChart },
  { match: /^HIS/i, icon: Landmark },
  { match: /^CHE/i, icon: FlaskConical },
  { match: /^PHI/i, icon: Scale },
  { match: /^MTH/i, icon: Ruler },
];

// Single purple/black/white palette — icon just varies, color doesn't.
const ICON_BG = "bg-purple-100 dark:bg-purple-500/10";
const ICON_FG = "text-purple-600 dark:text-purple-400";

const getSubjectVisual = (code: string) => {
  const found = ICON_MAP.find((entry) => entry.match.test(code));
  return { icon: found?.icon ?? BookOpen, bg: ICON_BG, fg: ICON_FG };
};

const timeAgo = (dateString?: string) => {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const SubjectsList = () => {
  const { data, isLoading, isError, refetch } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const totalCourses = data?.length || 0;
  const totalUnits =
    data?.reduce((acc, subject) => acc + Number(subject.unit || 0), 0) || 0;

  return (
    <div>
      <SubjectsSummary
        totalCourses={totalCourses}
        totalUnits={totalUnits}
        loading={isLoading}
      />

      {isError ? (
        <div className="mt-6">
          <LoadingError onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <motion.div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </motion.div>
      ) : data?.length === 0 ? (
        <div className="flex justify-center items-center py-10">
          <EmptyState />
        </div>
      ) : (
        <motion.div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {data?.map((subject) => {
            const { icon: Icon, bg, fg } = getSubjectVisual(subject.code);

            return (
              <motion.div
                key={subject._id}
                className="group relative bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-300"
                whileHover={{ scale: 1.005 }}
              >
                <div className="flex items-start justify-between">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon className={`w-5 h-5 ${fg}`} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300">
                      {subject.code}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-white/10 transition">
                          <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl bg-white dark:bg-[#1b1b1b] overflow-hidden border border-neutral-200 dark:border-white/10 shadow-xl"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition"
                          onClick={() => {
                            setSelectedSubject(subject);
                            setEditOpen(true);
                          }}
                        >
                          ✏️ Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-white/10 cursor-pointer transition"
                          onClick={() => {
                            setSelectedSubject(subject);
                            setDeleteOpen(true);
                          }}
                        >
                          <RiDeleteBin4Fill className="text-red-500" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
                  {subject.name}
                </p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {subject.progress}% complete
                </p>

                <div className="mt-4 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-purple-700 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {subject.unit} {Number(subject.unit) === 1 ? "Unit" : "Units"}
                  </span>
                  {subject.updatedAt && (
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {timeAgo(subject.updatedAt)}
                    </span>
                  )}
                </div>

                <Link
                  to={`/dashboard/notes/viewNotes/${subject._id}`}
                  className="mt-5 w-full inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-purple-200  text-purple-900 transition-colors"
                >
                  Select & Continue
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

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