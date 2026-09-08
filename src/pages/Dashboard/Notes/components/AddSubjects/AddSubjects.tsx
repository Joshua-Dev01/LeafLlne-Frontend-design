import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Hash, Layers, X, Plus } from "lucide-react";
import type { CreateSubjectPayload } from "../../types/Note";
import { addSubjectApi } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import AddButton from "../../../../../components/Button/Button";

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
  <div className="!space-y-1.5">
    <label className="!flex !items-center !gap-1.5 !text-[11px] !font-semibold !tracking-[0.18em] !uppercase !text-neutral-500 dark:!text-neutral-500 !font-['Source_Sans_3',_sans-serif]">
      <span className="!text-amber-500">{icon}</span>
      {label}
      {required && <span className="!text-rose-400 !ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="!text-[11px] !text-rose-500 !font-['Source_Sans_3',_sans-serif] !font-light">
        {error}
      </p>
    )}
  </div>
);

/* ─── Input class ────────────────────────────────────────────────────── */
const inputBase =
  "!w-full !h-11 !px-4 !rounded-sm !text-sm !outline-none !bg-neutral-50 dark:!bg-[#1a1a1a] !border !border-neutral-200 dark:!border-neutral-800 !text-neutral-800 dark:!text-white placeholder:!text-neutral-400 dark:placeholder:!text-neutral-600 focus:!border-[#0D1F3C] dark:focus:!border-neutral-500 focus:!ring-2 focus:!ring-[#0D1F3C]/[0.06] dark:focus:!ring-white/5 !font-['Source_Sans_3',_sans-serif] !font-light !transition-all !duration-200";

const inputError =
  "!border-rose-400 dark:!border-rose-500 focus:!ring-rose-400/10";

const AddSubjectModal = ({ onSuccess }: AddSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", code: "", unit: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateSubjectPayload) => addSubjectApi(payload),
    onSuccess: () => {
      handleResponse({ successMsg: "Subject added successfully", successCondition: true });
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
    if (!form.unit || isNaN(Number(form.unit))) e.unit = "A valid unit number is required";
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

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <div onClick={() => setOpen(true)}>
        <AddButton />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="!fixed !inset-0 !z-50 !flex !items-center !justify-center !px-4"
            style={{ background: "rgba(13,31,60,0.55)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="!relative !w-full !max-w-md !rounded-sm !overflow-hidden !bg-white dark:!bg-[#111111] !border !border-neutral-200 dark:!border-neutral-800 !shadow-[0_32px_80px_rgba(13,31,60,0.22)] dark:!shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
            >
              {/* ── Header ─────────────────────────────────────── */}
              <div className="!relative !bg-[#0D1F3C] dark:!bg-[#0f172a] !px-6 !py-5 !overflow-hidden">
                <div
                  className="!absolute !inset-0 !opacity-10 !pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(196,154,42,0.7) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="!absolute !top-0 !left-0 !right-0 !h-[2px] !bg-gradient-to-r !from-amber-600 !via-amber-400 !to-amber-600" />

                <div className="!relative !flex !items-center !justify-between">
                  <div className="!flex !items-center !gap-3">
                    <div className="!w-9 !h-9 !rounded-sm !flex !items-center !justify-center !bg-amber-500/15 !border !border-amber-400/30">
                      <BookOpen className="!w-4 !h-4 !text-amber-400" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="!text-[10px] !font-semibold !tracking-[0.2em] !uppercase !text-amber-500 !font-['Source_Sans_3',_sans-serif] !mb-0.5">
                        Academic Record
                      </p>
                      <h2 className="!font-['Georgia',_serif] !font-bold !text-[17px] !text-white !leading-tight">
                        Add New Subject
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="!w-8 !h-8 !flex !items-center !justify-center !rounded-sm !border !border-white/15 !text-white/60 hover:!border-white/30 hover:!text-white !transition-all !duration-200"
                  >
                    <X size={15} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              {/* ── Form ───────────────────────────────────────── */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="!px-6 !py-6 !space-y-5">

                  <Field
                    label="Subject Name"
                    required
                    icon={<BookOpen size={12} strokeWidth={1.8} />}
                    error={errors.name}
                  >
                    <input
                      value={form.name}
                      onChange={set("name")}
                      placeholder="e.g., Advanced Mathematics"
                      className={`${inputBase} ${errors.name ? inputError : ""}`}
                    />
                  </Field>

                  <div className="!grid !grid-cols-2 !gap-4">
                    <Field
                      label="Course Code"
                      required
                      icon={<Hash size={12} strokeWidth={1.8} />}
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
                      icon={<Layers size={12} strokeWidth={1.8} />}
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

                  <p className="!text-[11px] !font-light !italic !text-neutral-400 dark:!text-neutral-600 !font-['Georgia',_serif]">
                    All fields marked with * are required to register the subject.
                  </p>
                </div>

                {/* ── Footer ─────────────────────────────────── */}
                <div className="!px-6 !py-4 !border-t !border-neutral-100 dark:!border-neutral-800 !bg-neutral-50/70 dark:!bg-[#0d0d0d] !flex !items-center !justify-between !gap-3">
                  <p className="!text-[10px] !tracking-wide !text-neutral-400 dark:!text-neutral-600 !font-['Source_Sans_3',_sans-serif] !hidden sm:!block">
                    LeafLine · Academic Records
                  </p>

                  <div className="!flex !items-center !gap-3 !ml-auto">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isPending}
                      className="!px-5 !py-2.5 !rounded-sm !border !border-neutral-200 dark:!border-neutral-800 !text-neutral-600 dark:!text-neutral-400 !text-[12px] !font-semibold !tracking-wide !font-['Source_Sans_3',_sans-serif] hover:!border-neutral-300 dark:hover:!border-neutral-600 hover:!bg-neutral-100 dark:hover:!bg-[#1a1a1a] !transition-all !duration-200 disabled:!opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="!flex !items-center !gap-2 !px-6 !py-2.5 !rounded-sm !bg-[#0D1F3C] hover:!bg-[#163061] !text-amber-400 !font-semibold !text-[12px] !tracking-[0.12em] !uppercase !font-['Source_Sans_3',_sans-serif] disabled:!opacity-50 disabled:!cursor-not-allowed !transition-all !duration-200 hover:!shadow-[0_6px_20px_rgba(13,31,60,0.25)] hover:!-translate-y-0.5"
                    >
                      {isPending ? (
                        <>
                          <svg className="!animate-spin !w-3.5 !h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="!opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="!opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus size={14} strokeWidth={2} />
                          Add Subject
                        </>
                      )}
                    </button>
                  </div>
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