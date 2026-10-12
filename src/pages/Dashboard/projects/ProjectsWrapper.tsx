import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowUpDown,
  FolderPlus,
  FolderSearch,
  Plus,
  Search,
  SlidersHorizontal,
  // Sparkles,
  X,
  FileX2,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  EmptyBlock,
  GhostButton,
  Pagination,
  PrimaryButton,
  fieldClass,
} from "../Library/components/LibraryBits";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useDebounced } from "../Library/hooks/libraryHooks";
import { useProjectMutations, useProjectSummary, useProjects } from "./api/useProject";
import { CardSkeleton } from "./components/Bits";
import { InvitationsBanner, SummaryCards } from "./components/OverviewWidgets";
import { ProjectFormModal } from "./components/ProjectFormModal";
import type { ListParams } from "./interface/ProjectType";
import { CATEGORIES } from "./utils/projectTheme";
import { ProjectTable } from "./components/Projecttable";

type Tab = NonNullable<ListParams["tab"]>;

const ALL = "__all__"; // radio items need a non-empty value, so "no filter" uses this

const STATUS_OPTIONS = [
  { value: "not-started", label: "Not started" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];
const DEADLINE_OPTIONS = [
  { value: "overdue", label: "Overdue" },
  { value: "7d", label: "Next 7 days" },
  { value: "30d", label: "Next 30 days" },
  { value: "none", label: "No deadline" },
];
const SORT_OPTIONS = [
  { value: "recent", label: "Recent activity" },
  { value: "deadline", label: "Nearest deadline" },
  { value: "progress", label: "Most progress" },
  { value: "title", label: "Title (A–Z)" },
];

const iconBtn =
  "relative inline-flex items-center gap-2 h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500";

const ProjectsWrapper = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
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

  const restoringId: string | null = restore.isPending ? ((restore.variables as string) ?? null) : null;

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

  const activeFilters = [category, status, deadline].filter(Boolean).length;

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

      {/* Tabs */}
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
      </div>

      {/* Toolbar: search on the left, filter + sort on the right */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => reset(setSearch)(e.target.value)}
            placeholder="Search projects…"
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

        <div className="ml-auto flex items-center gap-2">
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={iconBtn} aria-label="Filter projects">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilters > 0 && (
                  <span className="min-w-5 h-5 px-1 rounded-full bg-violet-600 text-white text-[11px] font-semibold flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Category{category && <span className="ml-auto pl-3 text-xs text-violet-600">{category}</span>}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
                  <DropdownMenuRadioGroup
                    value={category || ALL}
                    onValueChange={(v) => reset(setCategory)(v === ALL ? "" : v)}
                  >
                    <DropdownMenuRadioItem value={ALL}>All categories</DropdownMenuRadioItem>
                    {CATEGORIES.map((c) => (
                      <DropdownMenuRadioItem key={c} value={c}>
                        {c}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={status || ALL}
                    onValueChange={(v) => reset(setStatus)((v === ALL ? "" : v) as ListParams["status"])}
                  >
                    <DropdownMenuRadioItem value={ALL}>Any status</DropdownMenuRadioItem>
                    {STATUS_OPTIONS.map((o) => (
                      <DropdownMenuRadioItem key={o.value} value={o.value}>
                        {o.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Deadline</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={deadline || ALL}
                    onValueChange={(v) => reset(setDeadline)((v === ALL ? "" : v) as ListParams["deadline"])}
                  >
                    <DropdownMenuRadioItem value={ALL}>Any time</DropdownMenuRadioItem>
                    {DEADLINE_OPTIONS.map((o) => (
                      <DropdownMenuRadioItem key={o.value} value={o.value}>
                        {o.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {hasFilters && (
                <>
                  <DropdownMenuSeparator />
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Clear filters
                  </button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={iconBtn} aria-label="Sort projects">
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Sort</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={(v) => reset(setSort)(v as typeof sort)}>
                {SORT_OPTIONS.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={o.value}>
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results */}
      {list.isLoading ? (
        <div className="grid gap-4 grid-cols-1">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <div className={cn("transition-opacity", list.isFetching && "opacity-60")}>
            <ProjectTable
              projects={projects}
              onRestore={(id) => restore.mutate(id)}
              restoringId={restoringId}
            />
          </div>
          <Pagination page={page} totalPages={list.data?.pages ?? 1} onChange={setPage} />
        </>
      )}

      <ProjectFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(p) => navigate(`/dashboard/projects/${p._id}`)}
      />
    </div>
  );
};

export default ProjectsWrapper;