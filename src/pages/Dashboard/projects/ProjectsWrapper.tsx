import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FolderPlus,
  FolderSearch,
  LayoutGrid,
  List,
  Plus,
  Search,
  Sparkles,
  X,
  FileX2,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  EmptyBlock,
  FilterSelect,
  GhostButton,
  Pagination,
  PrimaryButton,
  fieldClass,
} from "../Library/components/LibraryBits";
import { useDebounced } from "../Library/hooks/libraryHooks";
import { useProjectMutations, useProjectSummary, useProjects } from "./api/useProject";
import { CardSkeleton } from "./components/Bits";
import { InvitationsBanner, SummaryCards } from "./components/OverviewWidgets";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectFormModal } from "./components/ProjectFormModal";
import type { ListParams } from "./interface/ProjectType";
import { CATEGORIES } from "./utils/projectTheme";

type Tab = NonNullable<ListParams["tab"]>;

const readView = (): "grid" | "list" => {
  try {
    return localStorage.getItem("projects:view") === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
};

const ProjectsWrapper = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [view, setViewState] = useState<"grid" | "list">(readView);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ListParams["status"]>("");
  const [deadline, setDeadline] = useState<ListParams["deadline"]>("");
  const [sort, setSort] = useState<NonNullable<ListParams["sort"]>>("recent");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);

  const q = useDebounced(search.trim());
  const params: ListParams = { tab, q, category, status, deadline, sort, page, limit: 9 };
  const list = useProjects(params);
  const summary = useProjectSummary();
  const { restore } = useProjectMutations();

  const setView = (v: "grid" | "list") => {
    setViewState(v);
    try {
      localStorage.setItem("projects:view", v);
    } catch {
      /* private mode: just don't remember it */
    }
  };

  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const hasFilters = !!(q || category || status || deadline);
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setDeadline("");
    setPage(1);
  };

  const limit = summary.data?.limit;
  const atLimit = !!limit && limit.max !== null && limit.used >= limit.max;

  const startCreate = () => {
    if (atLimit && limit)
      return void toast.error(
        `You've reached the ${limit.plan} plan limit of ${limit.max} active projects. Archive or delete a project, or upgrade your plan.`,
      );
    setCreating(true);
  };

  const counts = list.data?.counts;
  const tabs: { key: Tab; label: string; count?: number }[] = useMemo(
    () => [
      { key: "all", label: "All Projects", count: counts?.all },
      { key: "mine", label: "My Projects", count: counts?.mine },
      { key: "team", label: "Team Projects", count: counts?.team },
      { key: "archived", label: "Archived", count: counts?.archived },
    ],
    [counts],
  );

  const projects = list.data?.projects ?? [];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Projects</h1>
            {limit && (
              <span className="hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold font-mono bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                {limit.max === null ? `${limit.used} active` : `${limit.used} / ${limit.max} active`}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Organise coursework, track milestones and coordinate group deliverables, all in one place.
          </p>
        </div>
        <PrimaryButton onClick={startCreate} className="h-11 px-5 shadow-lg shadow-violet-500/20">
          <Plus className="w-4 h-4" /> Create project
        </PrimaryButton>
      </header>

      {atLimit && limit && (
        <div className="rounded-xl border border-amber-300/60 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          You're using all {limit.max} active projects on the {limit.plan} plan. Archive or delete one to make room,
          or upgrade your plan.
        </div>
      )}

      <InvitationsBanner />
      <SummaryCards />

      {/* Tabs + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl bg-neutral-100 dark:bg-white/5 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => reset(setTab)(t.key)}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-sm font-medium whitespace-nowrap transition cursor-pointer",
                tab === t.key
                  ? "bg-white dark:bg-[#1c1c1c] text-violet-700 dark:text-violet-300 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white",
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] font-mono",
                    tab === t.key
                      ? "bg-violet-600 text-white dark:bg-violet-500"
                      : "bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300",
                  )}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl bg-neutral-100 dark:bg-white/5 p-1" role="group" aria-label="Layout">
          {(
            [
              ["grid", LayoutGrid, "Grid view"],
              ["list", List, "List view"],
            ] as const
          ).map(([k, Icon, label]) => (
            <button
              key={k}
              aria-label={label}
              aria-pressed={view === k}
              onClick={() => setView(k)}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer",
                view === k
                  ? "bg-white dark:bg-[#1c1c1c] text-violet-700 dark:text-violet-300 shadow-sm"
                  : "text-neutral-500",
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-3 sm:p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => reset(setSearch)(e.target.value)}
            placeholder="Search projects by name or description…"
            aria-label="Search projects"
            className={cn(fieldClass, "h-11 pl-10 pr-10")}
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => reset(setSearch)("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            label="Category"
            value={category}
            onChange={reset(setCategory)}
            placeholder="All categories"
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <FilterSelect
            label="Status"
            value={status ?? ""}
            onChange={(v) => reset(setStatus)(v as ListParams["status"])}
            placeholder="Any status"
            options={[
              { value: "not-started", label: "Not started" },
              { value: "in-progress", label: "In progress" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <FilterSelect
            label="Deadline"
            value={deadline ?? ""}
            onChange={(v) => reset(setDeadline)(v as ListParams["deadline"])}
            placeholder="Any time"
            options={[
              { value: "overdue", label: "Overdue" },
              { value: "7d", label: "Next 7 days" },
              { value: "30d", label: "Next 30 days" },
              { value: "none", label: "No deadline" },
            ]}
          />
          <FilterSelect
            label="Sort by"
            value={sort}
            onChange={(v) => reset(setSort)(v as typeof sort)}
            options={[
              { value: "recent", label: "Recent activity" },
              { value: "deadline", label: "Nearest deadline" },
              { value: "progress", label: "Most progress" },
              { value: "title", label: "Title (A–Z)" },
            ]}
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="self-end h-10 px-3 inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 dark:text-violet-300 hover:underline cursor-pointer"
            >
              <X className="w-4 h-4" /> Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      {list.isLoading ? (
        <div className={cn("grid gap-4", view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
          {Array.from({ length: view === "grid" ? 6 : 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : list.isError ? (
        <EmptyBlock
          icon={<FileX2 className="w-5 h-5" />}
          title="Couldn't load your projects"
          text="Check your connection and try again."
          action={<GhostButton onClick={() => list.refetch()}>Try again</GhostButton>}
        />
      ) : projects.length === 0 ? (
        hasFilters ? (
          <EmptyBlock
            icon={<FolderSearch className="w-5 h-5" />}
            title="No projects match your filters"
            text="Try a different search or clear the filters."
            action={<GhostButton onClick={clearFilters}>Clear filters</GhostButton>}
          />
        ) : (
          <EmptyBlock
            icon={<FolderPlus className="w-5 h-5" />}
            title={
              tab === "archived"
                ? "Nothing archived"
                : tab === "team"
                  ? "No team projects yet"
                  : "Start your first project"
            }
            text={
              tab === "archived"
                ? "Projects you archive will wait here until you restore them."
                : "Create a workspace, add tasks and invite classmates to collaborate."
            }
            action={
              tab !== "archived" && (
                <PrimaryButton onClick={startCreate}>
                  <Plus className="w-4 h-4" /> Create project
                </PrimaryButton>
              )
            }
          />
        )
      ) : (
        <>
          <div
            className={cn(
              "grid gap-4 transition-opacity",
              view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              list.isFetching && "opacity-60",
            )}
          >
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                view={view}
                onRestore={(id) => restore.mutate(id)}
                restoring={restore.isPending && restore.variables === p._id}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={list.data?.pages ?? 1} onChange={setPage} />
        </>
      )}

      {/* Footer call to action */}
      <section className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20">
        <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold">Got a new group assignment?</h3>
          <p className="text-sm text-white/80">
            Spin up a team workspace, split the tasks, and keep everyone's progress in one place.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="h-10 px-5 rounded-lg bg-white text-violet-700 text-sm font-semibold hover:bg-violet-50 transition cursor-pointer"
        >
          Create project
        </button>
      </section>

      <ProjectFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(p) => navigate(`/dashboard/projects/${p._id}`)}
      />
    </div>
  );
};

export default ProjectsWrapper;
