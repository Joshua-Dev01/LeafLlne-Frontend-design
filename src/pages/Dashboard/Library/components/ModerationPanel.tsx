import { useState } from "react";
import { Check, Eye, Flag, Inbox, Loader2, ShieldCheck, Sparkles, X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  useModerationActions,
  useModerationStats,
  useReports,
  useReviewQueue,
  useRunAiReview,
} from "../hooks/libraryHooks";
import type { LibraryReportItem, LibraryResource } from "../types/libraryTypes";
import {
  CATEGORY_META,
  REPORT_REASONS,
  fileTypeLabel,
  formatBytes,
  timeAgo,
  uploaderName,
} from "../utils/libraryUtils";
import {
  CloseButton,
  EmptyBlock,
  GhostButton,
  ModalShell,
  Pagination,
  PersonAvatar,
  PrimaryButton,
} from "./LibraryBits";

type Section = "pending" | "flagged" | "reports";

/* ── Reason prompt (reject a resource / remove after a report) ── */
const ReasonDialog = ({
  open,
  title,
  confirmLabel,
  minLength,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  confirmLabel: string;
  minLength: number;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}) => {
  const [text, setText] = useState("");
  const close = () => {
    setText("");
    onCancel();
  };
  return (
    <ModalShell open={open} onClose={close} className="sm:max-w-md" zIndex="z-[60]">
      <div className="flex items-start justify-between gap-3 p-5 pb-2">
        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">{title}</h3>
        <CloseButton onClick={close} />
      </div>
      <div className="px-5 pb-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={500}
          autoFocus
          placeholder="The uploader will see this message."
          className="w-full resize-none rounded-lg px-3 py-2 text-sm bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        />
      </div>
      <div className="flex justify-end gap-2 p-5 pt-3">
        <GhostButton onClick={close}>Cancel</GhostButton>
        <button
          disabled={busy || text.trim().length < minLength}
          onClick={() => {
            onConfirm(text.trim());
            setText("");
          }}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
};

/* ── Review row ── */
const ReviewRow = ({
  r,
  onOpen,
  actions,
}: {
  r: LibraryResource;
  onOpen: (id: string) => void;
  actions: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4 flex flex-col md:flex-row md:items-center gap-3">
    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        <span className="rounded-md px-2 py-0.5 bg-violet-50 text-[#4b0082] dark:bg-[#9d4edd]/15 dark:text-[#d9b8ff]">
          {CATEGORY_META[r.category].label}
        </span>
        {r.courseCode && <span className="font-mono">{r.courseCode}</span>}
        <span className="font-mono">
          {fileTypeLabel(r.fileType)} · {formatBytes(r.fileSize)}
        </span>
        {r.openReportCount > 0 && (
          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
            <Flag className="w-3 h-3" /> {r.openReportCount} open report
            {r.openReportCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <h4 className="font-semibold text-neutral-900 dark:text-white truncate">{r.title}</h4>
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <PersonAvatar resource={r} size={20} />
        <span>
          {uploaderName(r)} · {timeAgo(r.createdAt)}
        </span>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      <GhostButton onClick={() => onOpen(r._id)} className="h-9">
        <Eye className="w-4 h-4" /> Review
      </GhostButton>
      {actions}
    </div>
  </div>
);

/* ── Report row ── */
const ReportRow = ({
  rep,
  onOpen,
  onDismiss,
  onRemove,
  busy,
}: {
  rep: LibraryReportItem;
  onOpen: (id: string) => void;
  onDismiss: () => void;
  onRemove: () => void;
  busy: boolean;
}) => {
  const reason = REPORT_REASONS.find((x) => x.value === rep.reason)?.label ?? rep.reason;
  const res = rep.resourceId;
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-neutral-500">
            Reported by {rep.reporterId?.name ?? "a student"} · {timeAgo(rep.createdAt)}
          </p>
          <h4 className="font-semibold text-neutral-900 dark:text-white truncate">
            {res?.title ?? "Resource unavailable"}
          </h4>
          {res && (
            <p className="text-xs text-neutral-500">
              {res.courseCode ? `${res.courseCode} · ` : ""}
              uploaded by {res.uploaderId?.name ?? "unknown"} · {res.openReportCount} open report
              {res.openReportCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {reason}
        </span>
      </div>
      {rep.details && (
        <p className="text-sm rounded-lg px-3 py-2 bg-neutral-50 dark:bg-[#1a1a1a] text-neutral-700 dark:text-neutral-300">
          {rep.details}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {res && (
          <GhostButton onClick={() => onOpen(res._id)} className="h-9">
            <Eye className="w-4 h-4" /> View resource
          </GhostButton>
        )}
        <GhostButton onClick={onDismiss} disabled={busy} className="h-9">
          <Check className="w-4 h-4" /> Dismiss report
        </GhostButton>
        <button
          onClick={onRemove}
          disabled={busy}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" /> Remove resource
        </button>
      </div>
    </div>
  );
};

/* ── Panel ── */
export const ModerationPanel = ({ onOpen }: { onOpen: (id: string) => void }) => {
  const [section, setSection] = useState<Section>("pending");
  const [page, setPage] = useState(1);
  const stats = useModerationStats();
  const { approve, reject, resolve } = useModerationActions();
  const aiReview = useRunAiReview();

  const queue = useReviewQueue(
    section === "flagged" ? "flagged" : "pending",
    page,
    section !== "reports",
  );
  const reports = useReports(page, section === "reports");

  const [rejecting, setRejecting] = useState<string | null>(null);
  const [removingReport, setRemovingReport] = useState<string | null>(null);

  const switchSection = (s: Section) => {
    setSection(s);
    setPage(1);
  };

  const tabs: { key: Section; label: string; count?: number }[] = [
    { key: "pending", label: "Pending uploads", count: stats.data?.pending },
    { key: "flagged", label: "Flagged", count: stats.data?.flagged },
    { key: "reports", label: "Open reports", count: stats.data?.openReports },
  ];

  const active = section === "reports" ? reports : queue;
  const totalPages = active.data?.totalPages ?? 1;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Awaiting review", value: stats.data?.pending },
          { label: "Flagged", value: stats.data?.flagged },
          { label: "Open reports", value: stats.data?.openReports },
          { label: "Live resources", value: stats.data?.approved },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-4"
          >
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {s.value ?? "—"}
            </p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => switchSection(t.key)}
            className={cn(
              "h-9 px-4 rounded-full text-sm font-medium transition cursor-pointer inline-flex items-center gap-2",
              section === t.key
                ? "bg-[#4b0082] text-white dark:bg-[#9d4edd]"
                : "bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-mono",
                  section === t.key ? "bg-white/20" : "bg-neutral-100 dark:bg-[#1f1f1f]",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
        {section === "pending" && (
          <button
            onClick={() => aiReview.mutate()}
            disabled={aiReview.isPending}
            title="The AI reads pending PDFs and text files and approves or rejects them. Files it can't read stay here for you."
            className="ml-auto h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-2 border border-violet-300 dark:border-[#9d4edd]/50 text-[#4b0082] dark:text-[#d9b8ff] hover:bg-violet-50 dark:hover:bg-[#9d4edd]/10 disabled:opacity-50 transition cursor-pointer"
          >
            {aiReview.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Run AI review
          </button>
        )}
      </div>

      {active.isLoading ? (
        <div className="flex items-center gap-2 text-neutral-500 py-10 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading…
        </div>
      ) : section === "reports" ? (
        reports.data?.reports.length ? (
          <div className="space-y-3">
            {reports.data.reports.map((rep) => (
              <ReportRow
                key={rep._id}
                rep={rep}
                onOpen={onOpen}
                busy={resolve.isPending}
                onDismiss={() => resolve.mutate({ id: rep._id, action: "dismiss" })}
                onRemove={() => setRemovingReport(rep._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyBlock
            icon={<ShieldCheck className="w-5 h-5" />}
            title="No open reports"
            text="Reported resources will show up here for review."
          />
        )
      ) : queue.data?.resources.length ? (
        <div className="space-y-3">
          {queue.data.resources.map((r) => (
            <ReviewRow
              key={r._id}
              r={r}
              onOpen={onOpen}
              actions={
                <>
                  <PrimaryButton
                    className="h-9"
                    disabled={approve.isPending}
                    onClick={() => approve.mutate(r._id)}
                  >
                    <Check className="w-4 h-4" /> {section === "flagged" ? "Keep live" : "Approve"}
                  </PrimaryButton>
                  <button
                    onClick={() => setRejecting(r._id)}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyBlock
          icon={<Inbox className="w-5 h-5" />}
          title={section === "flagged" ? "Nothing flagged" : "Queue is clear"}
          text={
            section === "flagged"
              ? "Resources that collect several reports are hidden and listed here."
              : "New uploads waiting for approval will appear here."
          }
        />
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ReasonDialog
        open={!!rejecting}
        title="Reject this resource"
        confirmLabel="Reject"
        minLength={3}
        busy={reject.isPending}
        onCancel={() => setRejecting(null)}
        onConfirm={(reason) =>
          rejecting &&
          reject.mutate({ id: rejecting, reason }, { onSuccess: () => setRejecting(null) })
        }
      />
      <ReasonDialog
        open={!!removingReport}
        title="Remove this resource"
        confirmLabel="Remove resource"
        minLength={0}
        busy={resolve.isPending}
        onCancel={() => setRemovingReport(null)}
        onConfirm={(note) =>
          removingReport &&
          resolve.mutate(
            { id: removingReport, action: "remove", note: note || undefined },
            { onSuccess: () => setRemovingReport(null) },
          )
        }
      />
    </div>
  );
};