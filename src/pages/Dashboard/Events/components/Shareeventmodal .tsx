import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check, X, MessageCircle, Twitter, Send } from "lucide-react";
import { toast } from "sonner";
import { getShareLinkApi } from "../apis/eventsApi";
import type { Event } from "../types/eventsTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  event: Event;
}

export const ShareEventModal = ({ open, onClose, event }: Props) => {
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["share-link", event.id],
    queryFn: () => getShareLinkApi(event.id),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  const handleCopy = async () => {
    const link = data?.shareUrls.copy ?? window.location.href;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  const platforms = data
    ? [
        {
          label: "WhatsApp",
          href: data.shareUrls.whatsapp,
          icon: <MessageCircle size={18} />,
          bg: "bg-green-500 hover:bg-green-600",
        },
        {
          label: "Twitter / X",
          href: data.shareUrls.twitter,
          icon: <Twitter size={18} />,
          bg: "bg-sky-500 hover:bg-sky-600",
        },
        {
          label: "Telegram",
          href: data.shareUrls.telegram,
          icon: <Send size={18} />,
          bg: "bg-blue-500 hover:bg-blue-600",
        },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0F1A2E] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/8">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg font-['DM_Sans',sans-serif]">
              Share Event
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5 font-['DM_Sans',sans-serif] truncate max-w-[260px]">
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500 dark:text-white/40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Copy link */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-2 font-['DM_Sans',sans-serif]">
              Event Link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:text-white/60 truncate font-['DM_Sans',sans-serif]">
                {isLoading ? "Generating link..." : (data?.shareUrls.copy ?? "—")}
              </div>
              <button
                onClick={handleCopy}
                disabled={isLoading}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-[#0A1931] hover:bg-[#0d2240] text-white rounded-xl text-sm font-semibold transition-colors font-['DM_Sans',sans-serif] disabled:opacity-50"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share platforms */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-3 font-['DM_Sans',sans-serif]">
              Share via
            </p>
            <div className="grid grid-cols-3 gap-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse"
                    />
                  ))
                : platforms.map((p) => (
                    <a
                      key={p.label}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-white text-xs font-semibold transition-colors font-['DM_Sans',sans-serif] ${p.bg}`}
                    >
                      {p.icon}
                      {p.label}
                    </a>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};