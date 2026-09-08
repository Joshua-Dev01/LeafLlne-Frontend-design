import { useState } from "react";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Pencil, UploadCloud } from "lucide-react";
import { RiCloseLine } from "react-icons/ri";

import { updateNoteApi } from "../api/notesFlies.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import { Input } from "../../../../../components/ui/input";
import type { Note } from "../interface/notes";

interface EditNoteModalProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
}

const EditNoteModal = ({ note, open, onClose }: EditNoteModalProps) => {
  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const onOpen = () => {
    setTitle(note?.title ?? "");
    setDescription(note?.description ?? "");
    setFile(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateNoteApi(note!._id, formData),
    onSuccess: () => {
      handleResponse({ successCondition: true, successMsg: "Note updated" });
      queryClient.invalidateQueries({ queryKey: ["notes", note?.subjectId] });
      onClose();
    },
    onError: (error) => handleResponse({ error }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    mutate(formData);
  };

  return (
    <Modal
      open={open}
      afterOpenChange={(isOpen) => isOpen && onOpen()}
      onCancel={onClose}
      footer={null}
      closeIcon={
        <span className="text-black dark:text-gray-200 text-lg">
          <RiCloseLine className="!text-black dark:!text-gray-200 text-lg" />
        </span>
      }
    >
      <div className="flex items-center gap-3 mb-6">
        <Pencil className="text-blue-400 w-6 h-6" />
        <h2 className="text-xl dark:text-white text-black font-semibold">Edit Note</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-500 font-medium text-sm block mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-lg bg-gray-100 border border-white/20 !text-black rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-gray-500 font-medium text-sm block mb-1">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-lg bg-gray-100 border border-white/20 !text-black rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="text-gray-500 font-medium text-sm block mb-1">
            Replace file (optional)
          </label>
          <label
            htmlFor="edit-note-file"
            className="flex items-center gap-2 justify-center border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer text-gray-500 hover:border-blue-400 transition"
          >
            <UploadCloud className="w-5 h-5" />
            <span className="text-sm">{file ? file.name : "Keep current file"}</span>
          </label>
          <input
            id="edit-note-file"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <motion.button
            type="button"
            onClick={onClose}
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
            {isPending ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default EditNoteModal;