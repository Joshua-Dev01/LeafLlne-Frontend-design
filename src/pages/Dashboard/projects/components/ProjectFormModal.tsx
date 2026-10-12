import { useEffect, useState } from "react";
import { Loader2, Lock, Users } from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  CloseButton,
  GhostButton,
  ModalShell,
  PrimaryButton,
  fieldClass,
} from "../../Library/components/LibraryBits";
import { useProjectMutations } from "../api/useProject";
import type { Project, ProjectFormValues, Visibility } from "../interface/ProjectType";
import {
  CATEGORIES,
  COLOR_KEYS,
  COLOR_STYLES,
  ICONS,
  ICON_KEYS,
  toInputDate,
} from "../utils/projectTheme";
import { ProjectIcon } from "./Bits";

const blank: ProjectFormValues = {
  title: "",
  description: "",
  category: "Computer Science",
  startDate: "",
  deadline: "",
  visibility: "private",
  color: "violet",
  icon: "folder",
};

const fromProject = (p: Project): ProjectFormValues => ({
  title: p.title,
  description: p.description,
  category: p.category,
  startDate: toInputDate(p.startDate),
  deadline: toInputDate(p.deadline),
  visibility: p.visibility,
  color: p.color,
  icon: p.icon,
});

interface Props {
  open: boolean;
  onClose: () => void;
  /** When set, the form edits this project instead of creating one. */
  project?: Project;
  onCreated?: (p: Project) => void;
}

const Label = ({ children, hint, required }: { children: React.ReactNode; hint?: React.ReactNode; required?: boolean }) => (
  <div className="flex items-center justify-between mb-1.5">
    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </span>
    {hint && <span className="text-[11px] font-mono text-neutral-400">{hint}</span>}
  </div>
);

export const ProjectFormModal = ({ open, onClose, project, onCreated }: Props) => {
  const editing = !!project;
  const [v, setV] = useState<ProjectFormValues>(blank);
  const [touched, setTouched] = useState(false);
  const { create, update } = useProjectMutations();
  const busy = create.isPending || update.isPending;

  // Reset every time the modal opens.
  useEffect(() => {
    if (open) {
      setV(project ? fromProject(project) : blank);
      setTouched(false);
    }
  }, [open, project]);

  const set = <K extends keyof ProjectFormValues>(k: K, val: ProjectFormValues[K]) =>
    setV((x) => ({ ...x, [k]: val }));

  const errors = {
    title: v.title.trim().length < 3 ? "Give your project a title (at least 3 characters)." : "",
    dates:
      v.startDate && v.deadline && v.deadline < v.startDate
        ? "The deadline can't be before the start date."
        : "",
  };
  const valid = !errors.title && !errors.dates;
  const hasMembers = (project?.members.length ?? 0) > 1;

  const submit = () => {
    setTouched(true);
    if (!valid || busy) return;
    if (editing && project)
      update.mutate({ id: project._id, values: v }, { onSuccess: onClose });
    else
      create.mutate(v, {
        onSuccess: (r) => {
          onClose();
          onCreated?.(r.project);
        },
      });
  };

  const vis: { key: Visibility; label: string; hint: string; icon: typeof Lock }[] = [
    { key: "private", label: "Private", hint: "Only you can see it", icon: Lock },
    { key: "team", label: "Team", hint: "Invite classmates to collaborate", icon: Users },
  ];

  return (
    <ModalShell open={open} onClose={busy ? () => undefined : onClose} className="sm:max-w-2xl">
      <div className={cn("h-1.5 w-full bg-gradient-to-r", COLOR_STYLES[v.color].grad)} />
      <div className="flex items-start gap-4 p-5 pb-3">
        <ProjectIcon icon={v.icon} color={v.color} size={48} />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {editing ? "Edit project" : "Create new project"}
          </h2>
          <p className="text-sm text-neutral-500">
            {editing
              ? "Update the details of your workspace."
              : "Set up a workspace for your course, research or study team."}
          </p>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-5">
        <div>
          <Label required hint={`${v.title.length}/100`}>
            Project title
          </Label>
          <input
            value={v.title}
            onChange={(e) => set("title", e.target.value.slice(0, 100))}
            placeholder="e.g. Autonomous Rover Navigation (CSC-240 Capstone)"
            autoFocus
            aria-invalid={touched && !!errors.title}
            className={cn(fieldClass, touched && errors.title && "border-rose-400")}
          />
          {touched && errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label hint={`${v.description.length}/2000`}>Description</Label>
          <textarea
            value={v.description}
            onChange={(e) => set("description", e.target.value.slice(0, 2000))}
            rows={3}
            placeholder="A short overview of the goals and deliverables."
            className={cn(fieldClass, "h-auto py-2 resize-none")}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Category</Label>
            <select
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
              className={cn(fieldClass, "cursor-pointer")}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Start date</Label>
            <input
              type="date"
              value={v.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <input
              type="date"
              value={v.deadline}
              min={v.startDate || undefined}
              onChange={(e) => set("deadline", e.target.value)}
              className={cn(fieldClass, touched && errors.dates && "border-rose-400")}
            />
          </div>
        </div>
        {touched && errors.dates && <p className="text-xs text-rose-500 -mt-3">{errors.dates}</p>}

        <div>
          <Label>Who can access this?</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {vis.map((o) => {
              const disabled = o.key === "private" && hasMembers;
              return (
                <button
                  key={o.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => set("visibility", o.key)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition cursor-pointer",
                    v.visibility === o.key
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
                    disabled && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <o.icon className="w-4 h-4 mt-0.5 text-violet-600 dark:text-violet-300" />
                  <span>
                    <span className="block text-sm font-semibold text-neutral-900 dark:text-white">{o.label}</span>
                    <span className="block text-xs text-neutral-500">
                      {disabled ? "Remove members first to make it private" : o.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Colour</Label>
          <div className="flex flex-wrap gap-2.5">
            {COLOR_KEYS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={v.color === c}
                onClick={() => set("color", c)}
                className={cn(
                  "w-8 h-8 rounded-full bg-gradient-to-br transition cursor-pointer",
                  COLOR_STYLES[c].grad,
                  v.color === c
                    ? "ring-2 ring-offset-2 ring-violet-500 ring-offset-white dark:ring-offset-[#111111] scale-110"
                    : "hover:scale-105",
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Icon</Label>
          <div className="grid grid-cols-7 gap-2">
            {ICON_KEYS.map((k) => {
              const Icon = ICONS[k];
              return (
                <button
                  key={k}
                  type="button"
                  aria-label={k}
                  aria-pressed={v.icon === k}
                  onClick={() => set("icon", k)}
                  className={cn(
                    "h-10 rounded-lg flex items-center justify-center border transition cursor-pointer",
                    v.icon === k
                      ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-700",
                  )}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 p-5 pt-3 border-t border-neutral-100 dark:border-neutral-900">
        <GhostButton onClick={onClose} disabled={busy}>
          Cancel
        </GhostButton>
        <PrimaryButton onClick={submit} disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {editing ? "Save changes" : "Create project"}
        </PrimaryButton>
      </div>
    </ModalShell>
  );
};
