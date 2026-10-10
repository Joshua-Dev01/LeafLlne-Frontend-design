import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Hash, Layers, X, Plus, Loader2 } from "lucide-react";

import type { CreateSubjectPayload } from "../../types/Note";
import { addSubjectApi } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";

interface AddSubjectModalProps {
  onSuccess?: () => void;
}

/* ─── Local form state (unit as string for input binding) ────────────── */
interface FormState {
  name: string;
  code: string;
  unit: string; // kept as string locally; converted to number on submit
}

interface FormErrors {
  name?: string;
  code?: string;
  unit?: string;
}

/* ─── Field wrapper ──────────────────────────────────────────────────── */
const Field = ({
  label,
  required,
  icon,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
      <span className="text-purple-500 dark:text-purple-400">{icon}</span>
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-[11px] text-rose-500">{error}</p>}
  </div>
);

/* ─── Input class ────────────────────────────────────────────────────── */
const inputBase =
  "w-full h-11 px-4 rounded-xl text-sm outline-none bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-purple-900/30 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:border-purple-300 dark:focus:border-purple-500 transition-colors";

const inputError = "!border-rose-400 dark:!border-rose-500";

const AddSubjectModal = ({ onSuccess }: AddSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", code: "", unit: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateSubjectPayload) => addSubjectApi(payload),
    onSuccess: () => {
      handleResponse({
        successMsg: "Subject added successfully",
        successCondition: true,
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setForm({ name: "", code: "", unit: "" });
      setErrors({});
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => handleResponse({ error }),
  });

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Subject name is required";
    if (!form.code.trim()) e.code = "Course code is required";
    if (!form.unit || isNaN(Number(form.unit)))
      e.unit = "A valid unit number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload: CreateSubjectPayload = {
      name: form.name.trim(),
      code: form.code.trim(),
      unit: Number(form.unit),
    };
    mutate(payload);
  };

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
    setForm({ name: "", code: "", unit: "" });
    setErrors({});
  };

  const set =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 cursor-pointer! text-white text-sm font-semibold transition-colors"
      >
        <Plus className="w-4 h-4 " />
        Add Subject
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-purple-900/30 shadow-2xl"
            >
              {/* ── Header ─────────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-purple-900/20">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                      Academic Record
                    </p>
                    <h2 className="font-semibold text-base text-neutral-900 dark:text-white leading-tight">
                      Add New Subject
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-700 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Form ───────────────────────────────────────── */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="px-6 py-6 space-y-5">
                  <Field
                    label="Subject Name"
                    required
                    icon={<BookOpen className="w-3 h-3" />}
                    error={errors.name}
                  >
                    <input
                      value={form.name}
                      onChange={set("name")}
                      placeholder="e.g., Advanced Mathematics"
                      className={`${inputBase} ${errors.name ? inputError : ""}`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Course Code"
                      required
                      icon={<Hash className="w-3 h-3" />}
                      error={errors.code}
                    >
                      <input
                        value={form.code}
                        onChange={set("code")}
                        placeholder="e.g., MATH201"
                        className={`${inputBase} ${errors.code ? inputError : ""}`}
                      />
                    </Field>

                    <Field
                      label="Credit Units"
                      required
                      icon={<Layers className="w-3 h-3" />}
                      error={errors.unit}
                    >
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={form.unit}
                        onChange={set("unit")}
                        placeholder="e.g., 3"
                        className={`${inputBase} ${errors.unit ? inputError : ""}`}
                      />
                    </Field>
                  </div>

                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    All fields marked with * are required to register the
                    subject.
                  </p>
                </div>

                {/* ── Footer ─────────────────────────────────── */}
                <div className="px-6 py-4 border-t border-neutral-100 dark:border-purple-900/20 bg-neutral-50/60 dark:bg-[#0d0d0d] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-purple-900/30 text-neutral-600 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Subject
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddSubjectModal;
