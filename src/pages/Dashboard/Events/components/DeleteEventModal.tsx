import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { deleteEventApi } from "../apis/eventsApi";
import type { Event } from "../types/eventsTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  event: Event | null;
}

const DeleteEventModal = ({ open, onClose, event }: Props) => {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEventApi(event?.id ?? ""),
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["my-events"] });
      onClose();
    },
    onError: () => toast.error("Failed to delete event"),
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#0F1A2E] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/8 overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 dark:text-white/30 transition-colors"
        >
          <X size={14} />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
            <AlertTriangle size={26} className="text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-['DM_Sans',sans-serif]">
            Delete Event?
          </h2>

          <p className="text-sm text-slate-500 dark:text-white/40 mb-6 font-['DM_Sans',sans-serif]">
            This will permanently delete{" "}
            <span className="font-semibold text-slate-700 dark:text-white">
              {event?.title}
            </span>
            . This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 text-slate-600 dark:text-white/60 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/4 transition-colors font-['DM_Sans',sans-serif]"
            >
              Cancel
            </button>
            <button
              onClick={() => mutate()}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors font-['DM_Sans',sans-serif] disabled:opacity-60"
            >
              {isPending ? <LoaderCircle size={14} className="animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;