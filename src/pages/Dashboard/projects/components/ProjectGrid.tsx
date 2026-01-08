import { EmptyState } from "../../../../components/Empty/EmptyState";
import LoadingError from "../../../../components/errors/LoadingError";
import { useProjects } from "../api/useProject";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectSkeletonLoader";

export const ProjectsGrid = () => {
  const { data, isLoading, isError, refetch } = useProjects({
    page: 1,
    limit: 10,
    sort: "latest",
  });

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Unable to load projects right now.
        </p>
        <LoadingError onRetry={refetch} />
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!data || data.projects.length === 0) {
    return (
      <EmptyState />
    );
  }

  /* ---------- Data ---------- */
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-7">
      {data.projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
};
