import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubjectApi } from "../../api/subject.api";
import type { Subject } from "../../types/Note";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { handleResponse } from "../../../../../utils/handleErrors";

interface Props {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
}

const DeleteSubject: React.FC<Props> = ({ open, onClose, subject }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSubjectApi(subject?._id ?? ""),
    onSuccess: () => {
      handleResponse({ successMsg: "Subject deleted", successCondition: true });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onClose();
    },
    onError: (error) => handleResponse({ error }),
  });

  const handleClose = () => { if (!isPending) onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="!fixed !inset-0 !z-50 !flex !items-center !justify-center !px-4"
          style={{ background: "rgba(13,31,60,0.6)", backdropFilter: "blur(4px)" }}
          onClick={handleClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="!relative !w-full !max-w-sm !rounded-sm !overflow-hidden !bg-white dark:!bg-[#111111] !border !border-neutral-200 dark:!border-neutral-800 !shadow-[0_32px_80px_rgba(13,31,60,0.22)] dark:!shadow-[0_32px_80px_rgba(0,0,0,0.85)]"
          >
            {/* ── Header ──────────────────────────────────────── */}
            <div className="!relative !bg-rose-700 !px-6 !py-5 !overflow-hidden">
              {/* Dot grid */}
              <div
                className="!absolute !inset-0 !opacity-10 !pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Top rule */}
              <div className="!absolute !top-0 !left-0 !right-0 !h-[2px] !bg-gradient-to-r !from-rose-400 !via-red-300 !to-rose-400" />

              <div className="!relative !flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3">
                  <div className="!w-9 !h-9 !rounded-sm !flex !items-center !justify-center !bg-white/10 !border !border-white/20">
                    <Trash2 className="!w-4 !h-4 !text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="!text-[10px] !font-semibold !tracking-[0.2em] !uppercase !text-red-200 !font-['Source_Sans_3',_sans-serif] !mb-0.5">
                      Destructive Action
                    </p>
                    <h2 className="!font-['Georgia',_serif] !font-bold !text-[17px] !text-white !leading-tight">
                      Delete Subject
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="!w-8 !h-8 !flex !items-center !justify-center !rounded-sm !border !border-white/20 !text-white/60 hover:!border-white/40 hover:!text-white !transition-all !duration-200"
                >
                  <X size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* ── Body ────────────────────────────────────────── */}
            <div className="!px-6 !py-6 !space-y-4">

              {/* Warning icon + message */}
              <div className="!flex !items-start !gap-3">
                <div className="!w-9 !h-9 !flex-shrink-0 !rounded-sm !flex !items-center !justify-center !bg-rose-50 dark:!bg-rose-500/10 !border !border-rose-200 dark:!border-rose-500/20">
                  <AlertTriangle className="!w-4 !h-4 !text-rose-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="!font-['Georgia',_serif] !font-bold !text-[15px] !text-neutral-800 dark:!text-white !leading-snug !mb-1">
                    Are you sure you want to delete{" "}
                    <span className="!text-rose-600 dark:!text-rose-400 !italic">
                      {subject?.name}
                    </span>
                    ?
                  </p>
                  <p className="!text-[12.5px] !font-light !text-neutral-500 dark:!text-neutral-400 !font-['Source_Sans_3',_sans-serif] !leading-relaxed">
                    This action is permanent. All notes, progress records, and data
                    associated with this subject will be irreversibly removed.
                  </p>
                </div>
              </div>

              {/* Subject detail chip */}
              {subject && (
                <div className="!flex !items-center !gap-3 !px-4 !py-3 !rounded-sm !bg-neutral-50 dark:!bg-[#1a1a1a] !border !border-neutral-200 dark:!border-neutral-800">
                  <div className="!w-1 !h-8 !rounded-full !bg-rose-500 !flex-shrink-0" />
                  <div>
                    <p className="!text-[12px] !font-bold !text-neutral-800 dark:!text-white !font-['Source_Sans_3',_sans-serif]">
                      {subject.name}
                    </p>
                    <p className="!text-[10px] !text-neutral-400 dark:!text-neutral-600 !font-['Source_Sans_3',_sans-serif] !tracking-wide">
                      {subject.code} &nbsp;·&nbsp; {subject.unit} {Number(subject.unit) === 1 ? "Unit" : "Units"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ──────────────────────────────────────── */}
            <div className="!px-6 !py-4 !border-t !border-neutral-100 dark:!border-neutral-800 !bg-neutral-50/70 dark:!bg-[#0d0d0d] !flex !items-center !justify-between !gap-3">
              <p className="!text-[10px] !tracking-wide !text-neutral-400 dark:!text-neutral-600 !font-['Source_Sans_3',_sans-serif] !hidden sm:!block">
                This cannot be undone
              </p>

              <div className="!flex !items-center !gap-3 !ml-auto">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="!px-5 !py-2.5 !rounded-sm !border !border-neutral-200 dark:!border-neutral-800 !text-neutral-600 dark:!text-neutral-400 !text-[12px] !font-semibold !tracking-wide !font-['Source_Sans_3',_sans-serif] hover:!border-neutral-300 dark:hover:!border-neutral-600 hover:!bg-neutral-100 dark:hover:!bg-[#1a1a1a] !transition-all !duration-200 disabled:!opacity-40"
                >
                  Cancel
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => mutate()}
                  disabled={isPending}
                  className="!flex !items-center !gap-2 !px-6 !py-2.5 !rounded-sm !bg-rose-600 hover:!bg-rose-700 !text-white !font-semibold !text-[12px] !tracking-[0.12em] !uppercase !font-['Source_Sans_3',_sans-serif] disabled:!opacity-50 disabled:!cursor-not-allowed !transition-all !duration-200 hover:!shadow-[0_6px_20px_rgba(220,38,38,0.3)] hover:!-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <svg className="!animate-spin !w-3.5 !h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="!opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="!opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} strokeWidth={2} />
                      Delete Subject
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteSubject;