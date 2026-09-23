import { useState } from "react";
import { Modal, Select } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, UploadCloud } from "lucide-react";
import { RiCloseLine } from "react-icons/ri";

import { createNoteApi } from "../api/notesFlies.api";
import { getSubjects } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import { Input } from "../../../../../components/ui/input";
import AddButton from "../../../../../components/Button/Button";
import { useTheme } from "../../../../../context/theme";

interface AddNoteModalProps {
  /** Pre-selected subject (used from a subject's own notes page). If omitted,
   * a course dropdown is shown so the user can pick one (unified notes view). */
  subjectId?: string;
}

const AddNoteModal = ({ subjectId: fixedSubjectId }: AddNoteModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    enabled: open && !fixedSubjectId,
  });

  const subjectId = fixedSubjectId ?? selectedSubjectId;

  const reset = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setSelectedSubjectId(undefined);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => createNoteApi(subjectId!, formData),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Note added 🎉" });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      reset();
      setOpen(false);
    },
    onError: (error) => handleResponse({ error }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      handleResponse({ error: { message: "Title is required" } });
      return;
    }
    if (!subjectId) {
      handleResponse({ error: { message: "Pick a course first" } });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    // field name must be "file" — matches multer's upload.single("file") on the backend
    if (file) formData.append("file", file);

    mutate(formData);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        <AddButton />
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        styles={{ content: { backgroundColor: isDark ? "#1c1b1b" : "#fff" } }}
        closeIcon={
          <span className="text-black dark:text-gray-200 text-lg">
            <RiCloseLine className="!text-black dark:!text-gray-200 text-lg" />
          </span>
        }
      >
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-blue-400 w-6 h-6" />
          <h2 className="text-xl dark:text-white text-black font-semibold">Add New Note</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!fixedSubjectId && (
            <div>
              <label className="text-gray-500 dark:text-gray-400 font-medium text-sm block mb-1">Course</label>
              <Select
                className="w-full"
                loading={subjectsLoading}
                value={selectedSubjectId}
                placeholder="Select a course"
                options={(subjects ?? []).map((s) => ({ value: s._id, label: s.name }))}
                onChange={(v) => setSelectedSubjectId(v)}
              />
            </div>
          )}

          <div>
            <label className="text-gray-500 dark:text-gray-400 font-medium text-sm block mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 3 — Cell Structure"
              className="shadow-lg bg-gray-100 dark:!bg-[#262525] border border-white/20 dark:border-[#3a3740] !text-black dark:!text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-500 dark:text-gray-400 font-medium text-sm block mb-1">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional short summary"
              className="shadow-lg bg-gray-100 dark:!bg-[#262525] border border-white/20 dark:border-[#3a3740] !text-black dark:!text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-500 dark:text-gray-400 font-medium text-sm block mb-1">File (optional)</label>
            <label
              htmlFor="note-file"
              className="flex items-center gap-2 justify-center border-2 border-dashed border-gray-300 dark:border-[#3a3740] rounded-xl py-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:border-blue-400 transition"
            >
              <UploadCloud className="w-5 h-5" />
              <span className="text-sm">{file ? file.name : "PDF, image, or document"}</span>
            </label>
            <input
              id="note-file"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              type="button"
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 rounded-md bg-red-800 !text-white font-medium shadow-md hover:bg-red-700 transition cursor-pointer"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 rounded-md bg-blue-950 !text-white font-medium shadow-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Uploading..." : "Add Note"}
            </motion.button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddNoteModal;