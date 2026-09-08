import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { updateEventApi } from "../apis/eventsApi";
import type { Event } from "../types/eventsTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  event: Event;
}

export const EditEventModal = ({ open, onClose, event }: Props) => {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    topic: event.topic ?? "",
    date: event.date?.slice(0, 16) ?? "",
    location: event.location ?? "",
    image: null as File | null,
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: event.title,
        description: event.description,
        topic: event.topic ?? "",
        date: event.date?.slice(0, 16) ?? "",
        location: event.location ?? "",
        image: null,
      });
    }
  }, [open, event]);

  const mutation = useMutation({
    mutationFn: () => updateEventApi(event.id, form),
    onSuccess: () => {
      toast.success("Event updated!");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["my-events"] });
      onClose();
    },
    onError: () => toast.error("Failed to update event"),
  });

  if (!open) return null;

  const field = (name: keyof typeof form) => ({
    value: form[name] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  const inputClass = `
    w-full rounded-xl border border-slate-200 dark:border-white/8
    bg-slate-50 dark:bg-white/4
    px-4 py-2.5 text-sm text-slate-700 dark:text-white
    placeholder-slate-400 dark:placeholder-white/30
    focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 dark:focus:ring-white/10
    font-['DM_Sans',sans-serif]
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F1A2E] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/8">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg font-['DM_Sans',sans-serif]">
            Edit Event
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500 dark:text-white/40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1.5 font-['DM_Sans',sans-serif]">
                Title
              </label>
              <input {...field("title")} placeholder="Event title" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1.5 font-['DM_Sans',sans-serif]">
                Date & Time
              </label>
              <input type="datetime-local" {...field("date")} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1.5 font-['DM_Sans',sans-serif]">
                Topic
              </label>
              <input {...field("topic")} placeholder="Topic" className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1.5 font-['DM_Sans',sans-serif]">
                Location
              </label>
              <input {...field("location")} placeholder="Location" className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1.5 font-['DM_Sans',sans-serif]">
                Description
              </label>
              <textarea
                {...field("description")}
                rows={4}
                placeholder="Event description"
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Image upload */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1.5 font-['DM_Sans',sans-serif]">
                New Banner (optional)
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 dark:border-white/8 rounded-xl cursor-pointer hover:border-[#0A1931]/40 dark:hover:border-white/20 transition-colors">
                <Upload size={16} className="text-slate-400 dark:text-white/30" />
                <span className="text-sm text-slate-500 dark:text-white/40 font-['DM_Sans',sans-serif]">
                  {form.image ? form.image.name : "Click to upload new image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm((p) => ({ ...p, image: file }));
                  }}
                />
              </label>
              {event.image && !form.image && (
                <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5 font-['DM_Sans',sans-serif]">
                  Current banner will be kept if no new image is selected.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/8">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 text-slate-600 dark:text-white/60 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/4 transition-colors font-['DM_Sans',sans-serif]"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0A1931] hover:bg-[#0d2240] text-white text-sm font-semibold transition-colors font-['DM_Sans',sans-serif] disabled:opacity-60"
          >
            {mutation.isPending ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};