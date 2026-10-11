import { useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { LibraryResource, ResourceStatus } from "../types/libraryTypes";
import {
  STATUS_STYLES,
  initialsOf,
  uploaderName,
  uploaderPicture,
} from "../utils/libraryUtils";

/* ── Modal shell: overlay, Esc to close, body scroll lock ── */
export const ModalShell = ({
  open,
  onClose,
  children,
  className,
  zIndex = "z-50",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  zIndex?: string;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4",
        zIndex,
      )}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-2xl",
          "rounded-t-2xl sm:rounded-2xl max-h-[94vh] overflow-hidden flex flex-col",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Close"
    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-[#262525] transition cursor-pointer"
  >
    <X className="w-4 h-4" />
  </button>
);

/* ── Avatar ── */
export const PersonAvatar = ({
  resource,
  size = 28,
}: {
  resource: Pick<LibraryResource, "uploaderId">;
  size?: number;
}) => {
  const pic = uploaderPicture(resource);
  const name = uploaderName(resource);
  const style = { width: size, height: size, fontSize: size * 0.38 };
  return pic ? (
    <img
      src={pic}
      alt={name}
      style={style}
      className="rounded-full object-cover shrink-0 bg-neutral-200"
    />
  ) : (
    <span
      style={style}
      className="rounded-full shrink-0 flex items-center justify-center font-semibold bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/25 dark:text-[#d9b8ff]"
    >
      {initialsOf(name)}
    </span>
  );
};

/* ── Status badge ── */
export const StatusBadge = ({ status }: { status: ResourceStatus }) => {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
};

/* ── Pagination ── */
export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;
  const btn =
    "h-9 px-3 inline-flex items-center gap-1 rounded-lg text-sm border border-neutral-200 dark:border-neutral-800 " +
    "bg-white dark:bg-[#111111] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer";
  return (
    <div className="flex items-center justify-center gap-3 pt-6">
      <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <span className="text-sm text-neutral-500">
        Page {page} of {totalPages}
      </span>
      <button className={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ── Form controls ── */
export const fieldClass =
  "w-full h-10 rounded-lg px-3 text-sm bg-neutral-50 dark:bg-[#1a1a1a] text-neutral-900 dark:text-white " +
  "border border-neutral-200 dark:border-neutral-800 outline-none transition " +
  "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder:text-neutral-400";

export const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-1 min-w-[140px] flex-1">
    <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(fieldClass, "cursor-pointer")}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export const EmptyBlock = ({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center text-center py-14 px-6 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/20 dark:text-[#d9b8ff] mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
    {text && <p className="text-sm text-neutral-500 mt-1 max-w-sm">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const PrimaryButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium cursor-pointer",
      "bg-[#4b0082] hover:bg-[#5d1a8e] dark:bg-[#9d4edd] dark:hover:bg-[#b06ae8] text-white transition",
      "disabled:opacity-50 disabled:pointer-events-none",
      className,
    )}
  />
);

export const GhostButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium cursor-pointer",
      "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] text-neutral-800 dark:text-neutral-100",
      "hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition disabled:opacity-50 disabled:pointer-events-none",
      className,
    )}
  />
);
