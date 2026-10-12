import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  CloseButton,
  GhostButton,
  ModalShell,
  PrimaryButton,
  fieldClass,
} from "../../Library/components/LibraryBits";
import { useTaskMutations, useTasks } from "../api/useProject";
import type { Member, TaskPriority, TaskStatus } from "../interface/ProjectType";
import { PRIORITY_META, STATUS_META, toInputDate } from "../utils/projectTheme";
import { Avatar, ConfirmDialog } from "../components/Bits";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  members: Member[];
  /** Edit this task (looked up live so subtask changes show instantly). */
  taskId?: string | null;
  /** Column a new task should start in. */
  defaultStatus?: TaskStatus;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="block mb-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200">{children}</span>
);

export const TaskModal = ({ open, onClose, projectId, members, taskId, defaultStatus = "not-started" }: Props) => {
  const { data: tasks } = useTasks(projectId);
  const task = taskId ? tasks?.find((t) => t._id === taskId) : undefined;
  const editing = !!taskId;
  const m = useTaskMutations(projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [draftSubs, setDraftSubs] = useState<string[]>([]);
  const [newSub, setNewSub] = useState("");
  const [touched, setTouched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fill the form whenever the modal opens (or a different task is chosen).
  useEffect(() => {
    if (!open) return;
    setTouched(false);
    setNewSub("");
    setDraftSubs([]);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignedTo(task.assignedTo?._id ?? "");
      setDueDate(toInputDate(task.dueDate));
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDueDate("");
      setPriority("medium");
      setStatus(defaultStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, taskId]);

  const busy = m.create.isPending || m.update.isPending;
  const titleError = title.trim().length < 2 ? "Give the task a title." : "";

  const save = () => {
    setTouched(true);
    if (titleError || busy) return;
    const base = {
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      priority,
      status,
    };
    if (editing && taskId) m.update.mutate({ taskId, patch: base }, { onSuccess: onClose });
    else m.create.mutate({ ...base, subtasks: draftSubs }, { onSuccess: onClose });
  };

  const addSub = () => {
    const t = newSub.trim();
    if (!t) return;
    if (editing && taskId) m.addSubtask.mutate({ taskId, title: t });
    else setDraftSubs((s) => [...s, t]);
    setNewSub("");
  };

  const subs = editing ? (task?.subtasks ?? []) : draftSubs.map((t, i) => ({ _id: String(i), title: t, done: false }));
  const doneCount = subs.filter((s) => s.done).length;

  return (
    <>
      <ModalShell open={open} onClose={busy ? () => undefined : onClose} className="sm:max-w-xl">
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {editing ? "Edit task" : "New task"}
            </h2>
            <p className="text-sm text-neutral-500">
              {editing ? "Update details, assignee and subtasks." : "Break the project down into doable steps."}
            </p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          <div>
            <Label>Title</Label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 200))}
              autoFocus
              placeholder="e.g. Write the ROS2 Gazebo camera plugin"
              className={cn(fieldClass, touched && titleError && "border-rose-400")}
            />
            {touched && titleError && <p className="text-xs text-rose-500 mt-1">{titleError}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
              rows={3}
              placeholder="Add details, links or acceptance criteria"
              className={cn(fieldClass, "h-auto py-2 resize-none")}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Assignee</Label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={cn(fieldClass, "cursor-pointer")}
              >
                <option value="">Unassigned</option>
                {members.map((mem) => (
                  <option key={mem._id} value={mem._id}>
                    {mem.name}
                    {mem.isMe ? " (you)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Due date</Label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={fieldClass} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PRIORITY_META) as TaskPriority[]).reverse().map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={priority === p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "h-10 rounded-lg text-xs font-semibold border transition cursor-pointer inline-flex items-center justify-center gap-1.5",
                      priority === p
                        ? cn("border-transparent", PRIORITY_META[p].chip)
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300",
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_META[p].dot)} />
                    {PRIORITY_META[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={cn(fieldClass, "cursor-pointer")}
              >
                {(Object.keys(STATUS_META) as TaskStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Subtasks</Label>
              {subs.length > 0 && (
                <span className="text-[11px] font-mono text-neutral-400">
                  {doneCount}/{subs.length} done
                </span>
              )}
            </div>
            <ul className="space-y-1.5">
              {subs.map((s) => (
                <li
                  key={s._id}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-neutral-50 dark:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={s.done}
                    disabled={!editing || !taskId}
                    onChange={(e) =>
                      taskId && m.toggleSubtask.mutate({ taskId, subId: s._id, done: e.target.checked })
                    }
                    aria-label={`Mark "${s.title}" done`}
                    className="w-4 h-4 accent-violet-600 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm text-neutral-800 dark:text-neutral-100",
                      s.done && "line-through text-neutral-400",
                    )}
                  >
                    {s.title}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove "${s.title}"`}
                    onClick={() =>
                      editing && taskId
                        ? m.removeSubtask.mutate({ taskId, subId: s._id })
                        : setDraftSubs((d) => d.filter((_, i) => String(i) !== s._id))
                    }
                    className="text-neutral-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <input
                value={newSub}
                onChange={(e) => setNewSub(e.target.value.slice(0, 200))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSub();
                  }
                }}
                placeholder="Add a subtask and press Enter"
                className={fieldClass}
              />
              <GhostButton onClick={addSub} disabled={!newSub.trim()} aria-label="Add subtask" className="px-3">
                <Plus className="w-4 h-4" />
              </GhostButton>
            </div>
          </div>

          {editing && task && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {task.assignedTo && <Avatar person={task.assignedTo} size={18} />}
              <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 p-5 pt-3 border-t border-neutral-100 dark:border-neutral-900">
          <div>
            {editing && task?.canDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <GhostButton onClick={onClose} disabled={busy}>
              Cancel
            </GhostButton>
            <PrimaryButton onClick={save} disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Save task" : "Add task"}
            </PrimaryButton>
          </div>
        </div>
      </ModalShell>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this task?"
        message={`"${task?.title ?? "This task"}" and its subtasks will be removed from the project.`}
        confirmLabel="Delete task"
        busy={m.remove.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          taskId &&
          m.remove.mutate(taskId, {
            onSuccess: () => {
              setConfirmDelete(false);
              onClose();
            },
          })
        }
      />
    </>
  );
};
