import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { useReportResource } from "../hooks/libraryHooks";
import type { ReportReason } from "../types/libraryTypes";
import { REPORT_REASONS } from "../utils/libraryUtils";
import { CloseButton, GhostButton, ModalShell, PrimaryButton } from "./LibraryBits";

interface Props {
  open: boolean;
  resourceId: string;
  resourceTitle: string;
  onClose: () => void;
}

export const ReportDialog = ({ open, resourceId, resourceTitle, onClose }: Props) => {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");

  const close = () => {
    setReason(null);
    setDetails("");
    onClose();
  };

  const report = useReportResource(close);

  return (
    <ModalShell open={open} onClose={close} className="sm:max-w-md" zIndex="z-[60]">
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-500" /> Report resource
          </h2>
          <p className="text-sm text-neutral-500 truncate mt-0.5">{resourceTitle}</p>
        </div>
        <CloseButton onClick={close} />
      </div>

      <div className="px-5 pb-2 space-y-2 overflow-y-auto">
        {REPORT_REASONS.map((r) => (
          <label
            key={r.value}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition",
              reason === r.value
                ? "border-violet-500 bg-violet-50 dark:bg-[#9d4edd]/10"
                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300",
            )}
          >
            <input
              type="radio"
              name="report-reason"
              checked={reason === r.value}
              onChange={() => setReason(r.value)}
              className="mt-1 accent-[#4b0082]"
            />
            <span>
              <span className="block text-sm font-medium text-neutral-900 dark:text-white">
                {r.label}
              </span>
              <span className="block text-xs text-neutral-500">{r.hint}</span>
            </span>
          </label>
        ))}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Additional details (optional)"
          className="w-full resize-none rounded-lg px-3 py-2 text-sm bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      <div className="flex justify-end gap-2 p-5 pt-3">
        <GhostButton onClick={close}>Cancel</GhostButton>
        <PrimaryButton
          disabled={!reason || report.isPending}
          onClick={() =>
            reason && report.mutate({ id: resourceId, reason, details: details.trim() || undefined })
          }
        >
          {report.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit report
        </PrimaryButton>
      </div>
    </ModalShell>
  );
};
