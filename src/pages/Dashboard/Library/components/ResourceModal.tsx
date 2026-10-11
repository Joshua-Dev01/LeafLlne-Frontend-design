import { useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  Download,
  ExternalLink,
  Eye,
  FileWarning,
  Flag,
  Link2,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../../lib/utils";
import { handleResponse } from "../../../../utils/handleErrors";
import { getDownloadApi } from "../api/libraryApi";
import {
  useDeleteResource,
  usePreview,
  useResource,
  useToggleBookmark,
} from "../hooks/libraryHooks";
import type { PreviewResponse } from "../types/libraryTypes";
import {
  CATEGORY_META,
  compactNumber,
  fileTypeLabel,
  formatBytes,
  timeAgo,
  downloadFromUrl,
  uploaderName,
} from "../utils/libraryUtils";
import { AiPanel } from "./AiPanel";
import {
  CloseButton,
  GhostButton,
  ModalShell,
  PersonAvatar,
  PrimaryButton,
  StatusBadge,
} from "./LibraryBits";
import { ReportDialog } from "./ReportDialog";

/* ── Document viewer ── */
const Viewer = ({
  preview,
  loading,
  failed,
}: {
  preview?: PreviewResponse;
  loading: boolean;
  failed: boolean;
}) => {
  const frame = "w-full h-full rounded-xl bg-white";

  if (loading)
    return (
      <div className="h-full flex items-center justify-center text-neutral-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading preview…
      </div>
    );

  if (failed || !preview)
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-2 p-6 text-neutral-500">
        <FileWarning className="w-8 h-8" />
        <p className="text-sm">Preview isn’t available for this file.</p>
      </div>
    );

  if (preview.previewMode === "image")
    return (
      <div className="h-full overflow-auto flex items-start justify-center p-2">
        <img src={preview.url} alt={preview.fileName} className="max-w-full rounded-lg" />
      </div>
    );

  const src = preview.previewMode === "office" ? preview.viewerUrl : preview.url;
  return (
    <div className="h-full flex flex-col gap-2">
      <iframe
        title={preview.fileName}
        src={src}
        className={cn(frame, "flex-1 border border-neutral-200 dark:border-neutral-800")}
      />
      <a
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="self-end inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-[#4b0082] dark:hover:text-[#d9b8ff]"
      >
        <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
      </a>
    </div>
  );
};

/* ── Modal ── */
interface Props {
  resourceId: string | null;
  onClose: () => void;
}

export const ResourceModal = ({ resourceId, onClose }: Props) => {
  const open = !!resourceId;
  const { data: r, isLoading, isError } = useResource(resourceId);
  const previewQ = usePreview(resourceId);
  const bookmark = useToggleBookmark();
  const [reporting, setReporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const del = useDeleteResource(() => {
    setConfirmDelete(false);
    onClose();
  });

  const handleDownload = async () => {
    if (!r) return;
    setDownloading(true);
    try {
      const { downloadUrl, fileName } = await getDownloadApi(r._id);
      await downloadFromUrl(downloadUrl, fileName);
    } catch (e: unknown) {
      // API errors carry a response; errors from the file host are plain Errors.
      if (typeof e === "object" && e !== null && "response" in e) {
        handleResponse({ error: e });
      } else {
        toast.error(e instanceof Error ? e.message : "Download failed. Please try again.");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!r) return;
    const url = `${window.location.origin}/dashboard/library?resource=${r._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const meta = r ? CATEGORY_META[r.category] : null;
  const isApproved = r?.status === "approved";
  const canAskAi = isApproved || r?.isOwner;

  return (
    <>
      <ModalShell open={open} onClose={onClose} className="sm:max-w-6xl h-[94vh]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center gap-2 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading resource…
          </div>
        ) : isError || !r ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <p className="text-neutral-700 dark:text-neutral-200">
              This resource couldn’t be found. It may have been removed.
            </p>
            <GhostButton onClick={onClose}>Close</GhostButton>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="p-5 pb-4 border-b border-neutral-100 dark:border-neutral-900 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {r.courseCode && (
                      <span className="rounded-md px-2 py-1 font-mono font-medium bg-violet-50 text-[#4b0082] dark:bg-[#9d4edd]/15 dark:text-[#d9b8ff]">
                        {r.courseCode}
                        {r.subject ? ` · ${r.subject}` : ""}
                      </span>
                    )}
                    {meta && (
                      <span className="rounded-md px-2 py-1 bg-neutral-100 dark:bg-[#1f1f1f] text-neutral-600 dark:text-neutral-300">
                        {meta.label}
                      </span>
                    )}
                    {!isApproved && <StatusBadge status={r.status} />}
                    {r.session && <span className="text-neutral-500">{r.session} session</span>}
                    {r.level && <span className="text-neutral-500">{r.level} Level</span>}
                  </div>
                  <h2 className="text-xl font-semibold leading-snug text-neutral-900 dark:text-white">
                    {r.title}
                  </h2>
                </div>
                <CloseButton onClick={onClose} />
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
                <span className="inline-flex items-center gap-2">
                  <PersonAvatar resource={r} size={28} />
                  <span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-100">
                      {uploaderName(r)}
                    </span>{" "}
                    · {timeAgo(r.createdAt)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {compactNumber(r.viewCount)} views
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bookmark className="w-4 h-4" /> {compactNumber(r.bookmarkCount)} saves
                </span>
                <span className="inline-flex items-center gap-1">
                  <Download className="w-4 h-4" /> {compactNumber(r.downloadCount)}
                </span>
                {r.pageCount ? <span>{r.pageCount} pages</span> : null}
                <span className="font-mono text-xs">
                  {fileTypeLabel(r.fileType)} · {formatBytes(r.fileSize)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {r.canDownload ? (
                  <PrimaryButton onClick={handleDownload} disabled={downloading}>
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download ({formatBytes(r.fileSize)})
                  </PrimaryButton>
                ) : (
                  <span className="inline-flex items-center h-10 px-3 rounded-lg text-xs bg-neutral-100 dark:bg-[#1f1f1f] text-neutral-500">
                    Downloads disabled by uploader
                  </span>
                )}
                {isApproved && (
                  <GhostButton onClick={() => bookmark.mutate(r._id)}>
                    <Bookmark
                      className={cn(
                        "w-4 h-4",
                        r.isBookmarked && "fill-[#4b0082] text-[#4b0082] dark:fill-[#9d4edd] dark:text-[#9d4edd]",
                      )}
                    />
                    {r.isBookmarked ? "Saved" : "Save"}
                  </GhostButton>
                )}
                {isApproved && (
                  <GhostButton onClick={handleShare}>
                    <Link2 className="w-4 h-4" /> Share
                  </GhostButton>
                )}
                <div className="ml-auto flex items-center gap-2">
                  {r.isOwner && (
                    <GhostButton
                      onClick={() => setConfirmDelete(true)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </GhostButton>
                  )}
                  {isApproved && !r.isOwner && (
                    <button
                      onClick={() => setReporting(true)}
                      className="inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      <Flag className="w-4 h-4" /> Report
                    </button>
                  )}
                </div>
              </div>

              {r.status === "rejected" && r.rejectionReason && (
                <p className="text-sm rounded-lg px-3 py-2 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  <strong>Not approved:</strong> {r.rejectionReason}
                </p>
              )}
            </header>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="flex flex-col gap-3 min-h-[420px] lg:min-h-0 lg:overflow-y-auto">
                {r.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                    {r.description}
                  </p>
                )}
                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs rounded-full px-2.5 py-1 bg-violet-50 text-[#4b0082] dark:bg-[#9d4edd]/15 dark:text-[#d9b8ff]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex-1 min-h-[420px] rounded-xl bg-neutral-100 dark:bg-[#0d0d0d] p-2">
                  <Viewer
                    preview={previewQ.data}
                    loading={previewQ.isLoading}
                    failed={previewQ.isError}
                  />
                </div>
              </section>

              <div className="lg:overflow-y-auto">
                {canAskAi ? (
                  <AiPanel resourceId={r._id} />
                ) : (
                  <p className="text-sm text-neutral-500 p-4">
                    AI tools are available once this resource is live.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </ModalShell>

      {r && (
        <ReportDialog
          open={reporting}
          resourceId={r._id}
          resourceTitle={r.title}
          onClose={() => setReporting(false)}
        />
      )}

      {/* Delete confirmation */}
      <ModalShell
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        className="sm:max-w-sm"
        zIndex="z-[60]"
      >
        <div className="p-5 space-y-3">
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">
            Delete this resource?
          </h3>
          <p className="text-sm text-neutral-500">
            “{r?.title}” will be permanently removed from the Library, along with its bookmarks.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setConfirmDelete(false)}>Cancel</GhostButton>
            <button
              disabled={del.isPending}
              onClick={() => r && del.mutate(r._id)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer"
            >
              {del.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  );
};