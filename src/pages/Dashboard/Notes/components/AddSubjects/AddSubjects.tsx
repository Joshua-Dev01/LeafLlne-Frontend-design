import { useState } from "react";
import { Modal, Form } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSubjectPayload } from "../../types/Note";
import { addSubjectApi } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import AddButton from "../../../../../components/Button/Button";
import { Input } from "../../../../../components/ui/input";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { RiCloseLine } from "react-icons/ri";

interface AddSubjectModalProps {
  onSuccess?: () => void;
}

const AddSubjectModal = ({ onSuccess }: AddSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateSubjectPayload>();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addSubjectApi,
    onSuccess: () => {
      handleResponse({
        successMsg: "Subject added successfully 🎉",
        successCondition: true,
      });

      queryClient.invalidateQueries({ queryKey: ["subjects"] });

      form.resetFields();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      handleResponse({ error });
    },
  });

  const handleSubmit = (values: CreateSubjectPayload) => {
    mutate(values);
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
        className="  "
        closeIcon={
          <span className="text-black dark:text-gray-200 text-lg">
            <RiCloseLine className="!text-black dark:!text-gray-200 text-lg" />
          </span>
        }
      >
        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-blue-400 w-6 h-6" />
          <h2 className="text-xl  dark:text-white text-black font-semibold">Add New Subject</h2>
        </div>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={
              <span className="text-gray-500 font-medium">Subject Name</span>
            }
            name="name"
            rules={[{ required: true, message: "Please enter subject name" }]}
          >
            <Input
              placeholder="e.g., Mathematics"
              className=" shadow-lg bg-gray-100 border border-white/20 !text-black  rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-500 font-medium">Course Code</span>
            }
            name="code"
            rules={[{ required: true, message: "Please enter course code" }]}
          >
            <Input
              placeholder="e.g., MATH201"
              className="shadow-lg bg-gray-100 border border-white/20 !text-black rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-500 font-medium">Unit</span>}
            name="unit"
            rules={[{ required: true, message: "Please enter unit" }]}
          >
            <Input
              type="number"
              placeholder="e.g., 3"
              className="shadow-lg bg-gray-100 border border-white/20  rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 transition "
            />
          </Form.Item>

          {/* Action Buttons */}
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
              {isPending ? "Adding..." : "Add Subject"}
            </motion.button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddSubjectModal;
