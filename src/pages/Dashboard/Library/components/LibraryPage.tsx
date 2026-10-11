import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Bookmark,
  CloudUpload,
  FileX2,
  FolderOpen,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  useBookmarks,
  useCategories,
  useDebounced,
  useLibraryFilters,
  useModerationStats,
  useMyResources,
  usePopular,
  useResources,
  useToggleBookmark,
} from "../hooks/libraryHooks";
import type { PaginatedResources, ResourceCategory, ResourceSort } from "../types/libraryTypes";
import { CATEGORY_META, CATEGORY_ORDER, LEVELS, SORT_OPTIONS, compactNumber } from "../utils/libraryUtils";
import {
  EmptyBlock,
  FilterSelect,
  GhostButton,
  Pagination,
  PrimaryButton,
  fieldClass,
} from "./LibraryBits";
import { ModerationPanel } from "./ModerationPanel";
import { ResourceCard, ResourceCardSkeleton, ResourceGrid } from "./ResourceCard";
import { ResourceModal } from "./ResourceModal";
import { UploadResourceModal } from "./UploadResourceModal";

type View = "explore" | "saved" | "mine" | "moderation";

/* A paginated list of cards with loading / empty states. */
const ResourceList = ({
  query,
  page,
  onPage,
  onOpen,
  onBookmark,
  showStatus,
  empty,
}: {
  query: { data?: PaginatedResources; isLoading: boolean; isError: boolean; isFetching: boolean };
  page: number;
  onPage: (p: number) => void;
  onOpen: (id: string) => void;
  onBookmark?: (id: string) => void;
  showStatus?: boolean;
  empty: React.ReactNode;
}) => {
  if (query.isLoading)
    return (
      <ResourceGrid>
        {Array.from({ length: 8 }).map((_, i) => (
          <ResourceCardSkeleton key={i} />
        ))}
      </ResourceGrid>
    );

  if (query.isError)
    return (
      <EmptyBlock
        icon={<FileX2 className="w-5 h-5" />}
        title="Couldn’t load resources"
        text="Check your connection and try again."
      />
    );

  const items = query.data?.resources ?? [];
  if (!items.length) return <>{empty}</>;

  return (
    <>
      <div className={cn("transition-opacity", query.isFetching && "opacity-60")}>
        <ResourceGrid>
          {items.map((r) => (
            <ResourceCard
              key={r._id}
              resource={r}
              onOpen={onOpen}
              onToggleBookmark={onBookmark}
              showStatus={showStatus}
            />
          ))}
        </ResourceGrid>
      </div>
      <Pagination page={page} totalPages={query.data?.totalPages ?? 1} onChange={onPage} />
    </>
  );
};

export const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("resource");

  const [view, setView] = useState<View>("explore");
  const [uploadOpen, setUploadOpen] = useState(false);

  /* Explore state */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "">("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [sort, setSort] = useState<ResourceSort>("recent");
  const [page, setPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const [minePage, setMinePage] = useState(1);

  const q = useDebounced(search.trim());

  const categories = useCategories();
  const filters = useLibraryFilters();
  const moderation = useModerationStats(); // succeeds only for admins
  const isAdmin = moderation.isSuccess;
  const bookmark = useToggleBookmark();

  const hasFilters = !!(q || category || department || level || courseCode);

  const list = useResources({
    q,
    category,
    department,
    level,
    courseCode,
    sort,
    page,
    limit: 12,
  });
  const popular = usePopular(view === "explore" && !hasFilters);
  const saved = useBookmarks(savedPage, view === "saved");
  const mine = useMyResources(minePage, view === "mine");

  const countByCategory = useMemo(
    () => new Map(categories.data?.categories.map((c) => [c.key, c.count])),
    [categories.data],
  );
  const totalResources = categories.data?.categories.reduce((s, c) => s + c.count, 0) ?? 0;

  const openResource = useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams);
      next.set("resource", id);
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams],
  );
  const closeResource = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("resource");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const toggleBookmark = (id: string) => bookmark.mutate(id);

  const update = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDepartment("");
    setLevel("");
    setCourseCode("");
    setPage(1);
  };

  const applied: { label: string; clear: () => void }[] = [
    q && { label: `“${q}”`, clear: () => setSearch("") },
    category && { label: CATEGORY_META[category].label, clear: () => setCategory("") },
    department && { label: department, clear: () => setDepartment("") },
    level && { label: `${level} Level`, clear: () => setLevel("") },
    courseCode && { label: courseCode, clear: () => setCourseCode("") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const tabs: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: "explore", label: "Explore", icon: <FolderOpen className="w-4 h-4" /> },
    { key: "saved", label: "Saved", icon: <Bookmark className="w-4 h-4" /> },
    { key: "mine", label: "My uploads", icon: <CloudUpload className="w-4 h-4" /> },
    ...(isAdmin
      ? [{ key: "moderation" as View, label: "Moderation", icon: <ShieldCheck className="w-4 h-4" /> }]
      : []),
  ];

  const pendingBadge = isAdmin ? (moderation.data?.pending ?? 0) + (moderation.data?.flagged ?? 0) : 0;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
            Shared academic index
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Library
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Discover vetted academic resources. Share, study and learn together.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalResources > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800">
              <span className="font-mono">{compactNumber(totalResources)}</span> files
            </span>
          )}
          <PrimaryButton onClick={() => setUploadOpen(true)}>
            <CloudUpload className="w-4 h-4" /> Share a resource
          </PrimaryButton>
        </div>
      </header>

      {/* View tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={cn(
              "relative inline-flex items-center gap-2 px-4 h-11 text-sm font-medium whitespace-nowrap cursor-pointer transition",
              view === t.key
                ? "text-[#4b0082] dark:text-[#d9b8ff]"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white",
            )}
          >
            {t.icon}
            {t.label}
            {t.key === "moderation" && pendingBadge > 0 && (
              <span className="rounded-full bg-red-500 text-white text-[10px] px-1.5 font-mono">
                {pendingBadge}
              </span>
            )}
            {view === t.key && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#4b0082] dark:bg-[#9d4edd]" />
            )}
          </button>
        ))}
      </div>

      {/* ───────── Explore ───────── */}
      {view === "explore" && (
        <div className="space-y-7">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => update(setSearch)(e.target.value)}
              placeholder="Search study materials, past questions, textbooks or courses (e.g. CSC 201)…"
              className={cn(fieldClass, "h-12 pl-11 pr-10 text-[15px] rounded-xl")}
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => update(setSearch)("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Browse by category */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Browse by category
            </h2>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {CATEGORY_ORDER.map((key) => {
                const meta = CATEGORY_META[key];
                const Icon = meta.icon;
                const active = category === key;
                return (
                  <button
                    key={key}
                    onClick={() => update(setCategory)(active ? "" : key)}
                    className={cn(
                      "text-left rounded-2xl p-4 border transition cursor-pointer",
                      active
                        ? "border-[#4b0082] dark:border-[#9d4edd] bg-violet-50 dark:bg-[#9d4edd]/10 shadow-sm"
                        : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] hover:border-violet-300 dark:hover:border-[#9d4edd]/50",
                    )}
                  >
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/20 dark:text-[#d9b8ff]">
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <p className="mt-3 font-semibold text-sm text-neutral-900 dark:text-white">
                      {meta.label}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-1">{meta.blurb}</p>
                    <p className="mt-2 font-mono text-xs text-[#4b0082] dark:text-[#d9b8ff]">
                      {compactNumber(countByCategory.get(key) ?? 0)} items
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Popular */}
          {!hasFilters && (popular.isLoading || (popular.data?.resources.length ?? 0) > 0) && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4b0082] dark:text-[#d9b8ff]" /> Popular right
                now
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                {popular.isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="min-w-[280px] w-[280px] snap-start">
                        <ResourceCardSkeleton />
                      </div>
                    ))
                  : popular.data?.resources.map((r) => (
                      <div key={r._id} className="min-w-[280px] w-[280px] snap-start flex">
                        <div className="w-full">
                          <ResourceCard
                            resource={r}
                            onOpen={openResource}
                            onToggleBookmark={toggleBookmark}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-[#0d0d0d] p-4 space-y-3">
            <div className="flex flex-wrap gap-3">
              <FilterSelect
                label="Department"
                value={department}
                onChange={update(setDepartment)}
                placeholder="All departments"
                options={(filters.data?.departments ?? []).map((d) => ({ value: d, label: d }))}
              />
              <FilterSelect
                label="Level"
                value={level}
                onChange={update(setLevel)}
                placeholder="All levels"
                options={(filters.data?.levels.length ? filters.data.levels : LEVELS).map((l) => ({
                  value: l,
                  label: `${l} Level`,
                }))}
              />
              <FilterSelect
                label="Course"
                value={courseCode}
                onChange={update(setCourseCode)}
                placeholder="All courses"
                options={(filters.data?.courseCodes ?? []).map((c) => ({ value: c, label: c }))}
              />
              <FilterSelect
                label="Order by"
                value={sort}
                onChange={(v) => update(setSort)(v as ResourceSort)}
                options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
              />
            </div>
            {applied.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-neutral-500">Applied filters:</span>
                {applied.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => {
                      a.clear();
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/20 dark:text-[#d9b8ff] cursor-pointer"
                  >
                    {a.label} <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#4b0082] dark:text-[#d9b8ff] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </section>

          {/* Results */}
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {hasFilters
                    ? "Results"
                    : sort === "recent"
                      ? "Recently shared"
                      : "All resources"}
                </h2>
                <p className="text-sm text-neutral-500">
                  {hasFilters
                    ? `${list.data?.total ?? 0} matching resource${list.data?.total === 1 ? "" : "s"}`
                    : "Verified contributions from the community"}
                </p>
              </div>
            </div>
            <ResourceList
              query={list}
              page={page}
              onPage={setPage}
              onOpen={openResource}
              onBookmark={toggleBookmark}
              empty={
                <EmptyBlock
                  icon={<Search className="w-5 h-5" />}
                  title={hasFilters ? "No resources match your search" : "The Library is empty"}
                  text={
                    hasFilters
                      ? "Try different keywords or clear some filters."
                      : "Be the first to share notes, past questions or slides."
                  }
                  action={
                    hasFilters ? (
                      <GhostButton onClick={clearFilters}>Clear filters</GhostButton>
                    ) : (
                      <PrimaryButton onClick={() => setUploadOpen(true)}>
                        <CloudUpload className="w-4 h-4" /> Share a resource
                      </PrimaryButton>
                    )
                  }
                />
              }
            />
          </section>

          {/* Call to action */}
          <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/20 dark:text-[#d9b8ff] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Can’t find what you need?
              </h3>
              <p className="text-sm text-neutral-500">
                Share your own notes, past questions or slides to help fellow students.
              </p>
            </div>
            <PrimaryButton onClick={() => setUploadOpen(true)}>Upload a resource</PrimaryButton>
          </section>
        </div>
      )}

      {/* ───────── Saved ───────── */}
      {view === "saved" && (
        <ResourceList
          query={saved}
          page={savedPage}
          onPage={setSavedPage}
          onOpen={openResource}
          onBookmark={toggleBookmark}
          empty={
            <EmptyBlock
              icon={<Bookmark className="w-5 h-5" />}
              title="No saved resources yet"
              text="Tap the bookmark on any resource to keep it here for later."
              action={<GhostButton onClick={() => setView("explore")}>Explore the Library</GhostButton>}
            />
          }
        />
      )}

      {/* ───────── My uploads ───────── */}
      {view === "mine" && (
        <ResourceList
          query={mine}
          page={minePage}
          onPage={setMinePage}
          onOpen={openResource}
          onBookmark={toggleBookmark}
          showStatus
          empty={
            <EmptyBlock
              icon={<CloudUpload className="w-5 h-5" />}
              title="You haven’t shared anything yet"
              text="Upload notes, past questions or slides. They go live once a moderator approves them."
              action={
                <PrimaryButton onClick={() => setUploadOpen(true)}>
                  <CloudUpload className="w-4 h-4" /> Share a resource
                </PrimaryButton>
              }
            />
          }
        />
      )}

      {/* ───────── Moderation ───────── */}
      {view === "moderation" && isAdmin && <ModerationPanel onOpen={openResource} />}

      <ResourceModal resourceId={openId} onClose={closeResource} />
      <UploadResourceModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
};
