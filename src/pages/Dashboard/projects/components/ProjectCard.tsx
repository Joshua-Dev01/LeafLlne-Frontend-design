import { FolderKanban, CheckCircle2 } from "lucide-react";
import type { Project } from "../interface/ProjectType";
import { Avatar, Progress } from "antd";
import { useEffect, useState } from "react";
import { getProfilePicture } from "../../../../features/auth/profile/api/profileApi";

interface Props {
  project: Project;
}

export const ProjectCard = ({ project }: Props) => {
  const [dpUrl, setDpUrl] = useState<string | null>(null);

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (t) => t.status === "completed"
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const userName = project.createdBy?.name ?? "";
  const initials = userName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();

  useEffect(() => {
    const loadDp = async () => {
      try {
        const res = await getProfilePicture();
        if (res.picture?.url) {
          setDpUrl(res.picture.url);
        }
      } catch {
        setDpUrl(null);
      }
    };

    loadDp();
  }, []);

  return (
    <div
      className="
        group relative rounded-2xl p-[1px]
        bg-gradient-to-br 
        from-indigo-200/60 via-white to-white
        dark:from-indigo-900/40 dark:via-neutral-900 dark:to-neutral-900
        shadow-xl transition-all
      "
    >
      {/* Inner Card */}
      <div
        className="
          rounded-2xl p-5 h-full
          bg-gradient-to-br 
          from-white to-indigo-50/60
          dark:from-neutral-900 dark:to-neutral-950
          transition-all
          group-hover:translate-y-[-2px]
        "
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {project.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {project.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              {completedTasks}/{totalTasks} completed
            </span>
            <span>{progress}%</span>
          </div>

          <Progress
            percent={progress}
            size="small"
            showInfo={false}
            strokeColor="#6366f1"
          />
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {dpUrl ? (
              <Avatar
                src={dpUrl}
                size="default"
                className="!bg-transparent"
                onError={() => {
                  setDpUrl(null);
                  return false;
                }}
              />
            ) : (
              <Avatar className="!bg-indigo-600 dark:!bg-indigo-800">
                {initials}
              </Avatar>
            )}

            <span className="text-xs text-gray-600 dark:text-gray-400">
              {project.createdBy?.name}
            </span>
          </div>

          <span className="text-xs text-muted-foreground">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
