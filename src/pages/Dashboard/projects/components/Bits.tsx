import { Loader2 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  CloseButton,
  GhostButton,
  ModalShell,
} from "../../Library/components/LibraryBits";
import type { Person, ProjectColor, ProjectIconKey, TaskStatus } from "../interface/ProjectType";
import { COLOR_STYLES, ICONS, STATUS_META, avatarTone, initialsOf } from "../utils/projectTheme";

/* ── Avatar: real picture when a public URL exists, otherwise coloured initials ── */
export const Avatar = ({
  person,
  size = 28,
  ring = false,
  className,
}: {
  person: Pick<Person, "_id" | "name" | "picture"> | null | undefined;
  size?: number;
  ring?: boolean;
  className?: string;
}) => {
  const style = { width: size, height: size, fontSize: Math.max(9, size * 0.38) };
  const base = cn(
    "rounded-full shrink-0 inline-flex items-center justify-center font-semibold text-white select-none",
    ring && "ring-2 ring-white dark:ring-[#111111]",
    className,
  );
  if (!person || typeof person !== "object") return <span style={style} className={cn(base, "bg-neutral-300 dark:bg-neutral-700")}>?</span>;
  if (person.picture && /^https?:\/\//.test(person.picture))
    return (
      <img
        src={person.picture}
        alt={person.name}
        title={person.name}
        style={style}
        className={cn(base, "object-cover bg-neutral-200")}
      />
    );
  return (
    <span
      style={style}
      title={person.name}
      className={cn(base, avatarTone(person._id || person.name || "?"))}
    >
      {initialsOf(person.name || "")}
    </span>
  );
};

export const AvatarStack = ({
  people,
  max = 4,
  size = 28,
}: {
  people: Person[];
  max?: number;
  size?: number;
}) => {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p) => (
        <Avatar key={p._id} person={p} size={size} ring />
      ))}
      {extra > 0 && (
        <span
          style={{ width: size, height: size, fontSize: Math.max(9, size * 0.36) }}
          className="rounded-full ring-2 ring-white dark:ring-[#111111] inline-flex items-center justify-center font-semibold bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
        >
          +{extra}
        </span>
      )}
    </div>
  );
};

/* ── Coloured icon tile ── */
export const ProjectIcon = ({
  icon,
  color,
  size = 40,
  className,
}: {
  icon: ProjectIconKey;
  color: ProjectColor;
  size?: number;
  className?: string;
}) => {
  const Icon = ICONS[icon] ?? ICONS.folder;
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "rounded-xl shrink-0 inline-flex items-center justify-center text-white shadow-sm bg-gradient-to-br",
        COLOR_STYLES[color].grad,
        className,
      )}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2.1} />
    </span>
  );
};

/* ── Progress ── */
export const ProgressBar = ({
  percent,
  color = "violet",
  height = 8,
  label,
}: {
  percent: number;
  color?: ProjectColor;
  height?: number;
  label?: string;
}) => (
  <div
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label ?? "Progress"}
    style={{ height }}
    className="w-full rounded-full bg-neutral-200/80 dark:bg-white/10 overflow-hidden"
  >
    <div
      style={{ width: `${Math.max(percent, percent > 0 ? 3 : 0)}%` }}
      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", COLOR_STYLES[color].bar)}
    />
  </div>
);

export const StatusChip = ({ status, className }: { status: TaskStatus; className?: string }) => {
  const m = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        m.chip,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
};

/* ── Confirmation dialog for destructive actions ── */
export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  danger = true,
  busy = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <ModalShell open={open} onClose={busy ? () => undefined : onClose} className="sm:max-w-sm" zIndex="z-[70]">
    <div className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">{title}</h3>
        <CloseButton onClick={onClose} />
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
      <div className="flex justify-end gap-2 pt-2">
        <GhostButton onClick={onClose} disabled={busy}>
          Cancel
        </GhostButton>
        <button
          onClick={onConfirm}
          disabled={busy}
          className={cn(
            "inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium text-white cursor-pointer disabled:opacity-50",
            danger ? "bg-rose-600 hover:bg-rose-700" : "bg-[#4b0082] hover:bg-[#5d1a8e] dark:bg-[#9d4edd]",
          )}
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </div>
  </ModalShell>
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] p-5 animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
    <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
    <div className="h-3 w-2/3 rounded bg-neutral-100 dark:bg-neutral-900" />
    <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 mt-6" />
    <div className="flex justify-between">
      <div className="h-3 w-28 rounded bg-neutral-100 dark:bg-neutral-900" />
      <div className="h-6 w-20 rounded-full bg-neutral-100 dark:bg-neutral-900" />
    </div>
  </div>
);
