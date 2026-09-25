import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, X, AlertTriangle } from "lucide-react";

import { deleteNote } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import type { Note } from "../interface/notes";

interface Props {
  open: boolean;
  onClose: () => void;
  note: Note | null;
}

const DeleteNote: React.FC<Props> = ({ open, onClose, note }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteNote(note?._id ?? ""),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Note deleted" });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (error) => handleResponse({ error }),
  });

  const handleClose = () => {
    if (!isPending) onClose();
  };

  const courseLabel =
    note && typeof note.subjectId === "object" ? note.subjectId?.code : undefined;

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
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={handleClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="!relative !w-full !max-w-sm !rounded-2xl !overflow-hidden !bg-white dark:!bg-black !border !border-neutral-200 dark:!border-purple-900/40 !shadow-[0_32px_80px_rgba(0,0,0,0.35)] dark:!shadow-[0_32px_80px_rgba(0,0,0,0.85)]"
          >
            <div className="!relative !bg-rose-600 !px-6 !py-5 !overflow-hidden">
              <div className="!absolute !top-0 !left-0 !right-0 !h-[2px] !bg-gradient-to-r !from-rose-300 !via-white/60 !to-rose-300" />
              <div className="!relative !flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3">
                  <div className="!w-9 !h-9 !rounded-lg !flex !items-center !justify-center !bg-white/15 !border !border-white/25">
                    <Trash2 className="!w-4 !h-4 !text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="!text-[10px] !font-semibold !tracking-[0.2em] !uppercase !text-rose-100 !mb-0.5">
                      Destructive Action
                    </p>
                    <h2 className="!font-bold !text-[17px] !text-white !leading-tight">
                      Delete Note
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="!w-8 !h-8 !flex !items-center !justify-center !rounded-lg !border !border-white/25 !text-white/70 hover:!border-white/50 hover:!text-white !transition-all !duration-200"
                >
                  <X size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="!px-6 !py-6 !space-y-4">
              <div className="!flex !items-start !gap-3">
                <div className="!w-9 !h-9 !flex-shrink-0 !rounded-lg !flex !items-center !justify-center !bg-rose-50 dark:!bg-rose-500/10 !border !border-rose-200 dark:!border-rose-500/20">
                  <AlertTriangle className="!w-4 !h-4 !text-rose-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="!font-bold !text-[15px] !text-neutral-800 dark:!text-white !leading-snug !mb-1">
                    Delete{" "}
                    <span className="!text-rose-600 dark:!text-rose-400 !italic">
                      "{note?.title}"
                    </span>
                    ?
                  </p>
                  <p className="!text-[12.5px] !font-light !text-neutral-500 dark:!text-neutral-400 !leading-relaxed">
                    This note and any attached file will be permanently removed.
                    This action can't be undone.
                  </p>
                </div>
              </div>

              {note && (
                <div className="!flex !items-center !gap-3 !px-4 !py-3 !rounded-xl !bg-neutral-50 dark:!bg-[#111111] !border !border-neutral-200 dark:!border-purple-900/30">
                  <div className="!w-1 !h-8 !rounded-full !bg-rose-500 !flex-shrink-0" />
                  <div>
                    <p className="!text-[12px] !font-bold !text-neutral-800 dark:!text-white">
                      {note.title}
                    </p>
                    {courseLabel && (
                      <p className="!text-[10px] !text-neutral-400 dark:!text-neutral-500 !tracking-wide">
                        {courseLabel}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="!px-6 !py-4 !border-t !border-neutral-100 dark:!border-purple-900/30 !bg-neutral-50/70 dark:!bg-[#0a0a0a] !flex !items-center !justify-end !gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="!px-5 !py-2.5 !rounded-lg !border !border-neutral-200 dark:!border-neutral-800 !text-neutral-600 dark:!text-neutral-400 !text-[12px] !font-semibold !tracking-wide hover:!border-neutral-300 dark:hover:!border-neutral-600 hover:!bg-neutral-100 dark:hover:!bg-[#1a1a1a] !transition-all !duration-200 disabled:!opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => mutate()}
                disabled={isPending}
                className="!flex !items-center !gap-2 !px-6 !py-2.5 !rounded-lg !bg-rose-600 hover:!bg-rose-700 !text-white !font-semibold !text-[12px] !tracking-[0.12em] !uppercase disabled:!opacity-50 disabled:!cursor-not-allowed !transition-all !duration-200"
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
                    Delete Note
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteNote;