import { useRef, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  History,
  Loader2,
  MessageSquare,
  Send,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../../lib/utils";
import { handleResponse } from "../../../../utils/handleErrors";
import { EmptyBlock, Pagination, fieldClass } from "../../Library/components/LibraryBits";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME,
  MAX_FILE_BYTES,
  downloadFromUrl,
  fileTypeLabel,
  formatBytes,
  timeAgo,
} from "../../Library/utils/libraryUtils";
import { getFileLinkApi } from "../api/Project";
import {
  useActivity,
  useCommentMutations,
  useComments,
  useFileMutations,
  useFiles,
} from "../api/useProject";
import { Avatar, ConfirmDialog } from "../components/Bits";
import type { ActivityItem, ProjectFileItem } from "../interface/ProjectType";

/* ── Activity ── */
const DOT: Record<string, string> = {
  "task.completed": "bg-emerald-500",
  "task.created": "bg-violet-500",
  "task.status": "bg-sky-500",
  "task.deleted": "bg-rose-500",
  "file.uploaded": "bg-fuchsia-500",
  "member.joined": "bg-teal-500",
  "member.invited": "bg-teal-400",
};

export const ActivityRow = ({ a }: { a: ActivityItem }) => (
  <li className="flex gap-3">
    <div className="relative">
      <Avatar person={a.actor} size={30} />
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#111111]",
          DOT[a.type] ?? "bg-neutral-400",
        )}
      />
    </div>
    <div className="min-w-0 flex-1 pb-1">
      <p className="text-sm text-neutral-700 dark:text-neutral-200">
        <span className="font-semibold text-neutral-900 dark:text-white">{a.actor?.name ?? "Someone"}</span> {a.text}
      </p>
      <p className="text-[11px] text-neutral-400 mt-0.5">{timeAgo(a.createdAt)}</p>
    </div>
  </li>
);

export const ActivityTab = ({ projectId }: { projectId: string }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivity(projectId, page);
  if (isLoading) return <p className="text-sm text-neutral-500 py-8 text-center">Loading activity…</p>;
  if (!data?.activity.length)
    return <EmptyBlock icon={<History className="w-5 h-5" />} title="No activity yet" text="Updates will show up here as the team works." />;
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-5">
      <ul className="space-y-4">
        {data.activity.map((a) => (
          <ActivityRow key={a._id} a={a} />
        ))}
      </ul>
      <Pagination page={page} totalPages={data.pages} onChange={setPage} />
    </div>
  );
};

/* ── Discussion ── */
export const DiscussionTab = ({ projectId, writable }: { projectId: string; writable: boolean }) => {
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const { data, isLoading } = useComments(projectId, page);
  const { add, remove } = useCommentMutations(projectId);

  const send = () => {
    const body = text.trim();
    if (!body || add.isPending) return;
    add.mutate(body, {
      onSuccess: () => {
        setText("");
        setPage(1);
      },
    });
  };

  return (
    <div className="space-y-4">
      {writable && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-3 flex gap-3 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 2000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
            }}
            rows={2}
            aria-label="Write a comment"
            placeholder="Share an update or ask the team a question…  (Ctrl+Enter to send)"
            className={cn(fieldClass, "h-auto py-2 resize-none")}
          />
          <button
            onClick={send}
            disabled={!text.trim() || add.isPending}
            aria-label="Post comment"
            className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center text-white bg-[#4b0082] hover:bg-[#5d1a8e] dark:bg-[#9d4edd] disabled:opacity-40 cursor-pointer"
          >
            {add.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-500 py-8 text-center">Loading discussion…</p>
      ) : !data?.comments.length ? (
        <EmptyBlock icon={<MessageSquare className="w-5 h-5" />} title="No messages yet" text="Start the conversation with your team." />
      ) : (
        <>
          <ul className="space-y-3">
            {data.comments.map((c) => (
              <li
                key={c._id}
                className="group flex gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4"
              >
                <Avatar person={c.author} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">{c.author?.name ?? "Someone"}</span>
                    <span className="text-[11px] text-neutral-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap break-words mt-0.5">{c.body}</p>
                </div>
                {c.canDelete && writable && (
                  <button
                    aria-label="Delete comment"
                    onClick={() => remove.mutate(c._id)}
                    className="self-start text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

/* ── Files ── */
export const FilesTab = ({ projectId, writable }: { projectId: string; writable: boolean }) => {
  const { data: files, isLoading } = useFiles(projectId);
  const { upload, remove, progress } = useFileMutations(projectId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [target, setTarget] = useState<ProjectFileItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pick = (f?: File | null) => {
    if (!f) return;
    const ext = `.${f.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ACCEPTED_MIME.has(f.type) && !ACCEPTED_EXTENSIONS.split(",").includes(ext))
      return void toast.error("Unsupported file. Upload a PDF, Word, PowerPoint, Excel, text or image file.");
    if (f.size > MAX_FILE_BYTES)
      return void toast.error(`File is too large. Maximum size is ${MAX_FILE_BYTES / (1024 * 1024)}MB.`);
    upload.mutate(f);
  };

  const open = async (f: ProjectFileItem, mode: "view" | "download") => {
    setBusyId(f._id);
    try {
      const link = await getFileLinkApi(projectId, f._id);
      if (mode === "view") window.open(link.url, "_blank", "noopener,noreferrer");
      else await downloadFromUrl(link.downloadUrl, link.fileName);
    } catch (e: any) {
      if (e?.response) handleResponse({ error: e });
      else toast.error(e?.message || "Couldn't open the file.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {writable && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={cn(
            "rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition",
            drag
              ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
              : "border-neutral-300 dark:border-neutral-700 hover:border-violet-400",
          )}
        >
          {upload.isPending ? (
            <div className="max-w-xs mx-auto space-y-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Uploading… {progress}%</p>
              <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" />
              </div>
            </div>
          ) : (
            <>
              <UploadCloud className="w-7 h-7 mx-auto text-violet-600 dark:text-violet-300" />
              <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">Drop a file here, or click to browse</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                PDF, Word, PowerPoint, Excel, text or image · up to {MAX_FILE_BYTES / (1024 * 1024)}MB
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            hidden
            accept={ACCEPTED_EXTENSIONS}
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-500 py-8 text-center">Loading files…</p>
      ) : !files?.length ? (
        <EmptyBlock icon={<FolderOpen className="w-5 h-5" />} title="No files yet" text="Share datasets, drafts and references with your team." />
      ) : (
        <ul className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] divide-y divide-neutral-100 dark:divide-neutral-900">
          {files.map((f) => (
            <li key={f._id} className="flex items-center gap-3 p-3.5">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 shrink-0">
                <FileText className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{f.fileName}</p>
                <p className="text-xs text-neutral-500">
                  <span className="font-mono">{fileTypeLabel(f.fileType)}</span> · {formatBytes(f.fileSize)} ·{" "}
                  {f.uploader?.name ?? "Someone"} · {timeAgo(f.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {busyId === f._id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400 mx-2" />
                ) : (
                  <>
                    <button aria-label="View file" title="View" onClick={() => open(f, "view")} className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button aria-label="Download file" title="Download" onClick={() => open(f, "download")} className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
                {f.canDelete && writable && (
                  <button aria-label="Remove file" title="Remove" onClick={() => setTarget(f)} className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!target}
        title="Remove this file?"
        message={`"${target?.fileName}" will be deleted for everyone on the project.`}
        confirmLabel="Remove file"
        busy={remove.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && remove.mutate(target._id, { onSuccess: () => setTarget(null) })}
      />
    </div>
  );
};
