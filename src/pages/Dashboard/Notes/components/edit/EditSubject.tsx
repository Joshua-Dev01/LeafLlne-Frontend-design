import { Modal, Form } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Subject } from "../../types/Note";
import { editSubjectApi } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import { Input } from "../../../../../components/ui/input";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useEffect } from "react";

interface EditSubjectModalProps {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
}

const EditSubject: React.FC<EditSubjectModalProps> = ({ open, onClose, subject }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Reset form values whenever subject changes
  useEffect(() => {
    if (subject) {
      form.setFieldsValue({
        name: subject.name,
        code: subject.code,
        unit: subject.unit,
      });
    } else {
      form.resetFields();
    }
  }, [subject, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: Partial<Subject>) =>
      editSubjectApi(subject?._id || "", values),
    onSuccess: () => {
      handleResponse({
        successMsg: "Subject updated successfully ✨",
        successCondition: true,
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onClose();
    },
    onError: (error) => {
      handleResponse({ error });
    },
  });

  const handleSubmit = (values: Partial<Subject>) => {
    mutate(values);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="custom-dark-modal"
      closeIcon={<span className="text-white text-lg">✕</span>}
    >
      {/* Modal Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-blue-400 w-6 h-6" />
        <h2 className="text-xl font-bold text-white">Edit Subject</h2>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={<span className="text-gray-300 font-medium">Subject Name</span>}
          name="name"
          rules={[{ required: true, message: "Please enter subject name" }]}
        >
          <Input className="!bg-white/10 border border-white/20 !text-white rounded-xl px-4 py-2" />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300 font-medium">Course Code</span>}
          name="code"
          rules={[{ required: true, message: "Please enter course code" }]}
        >
          <Input className="!bg-white/10 border border-white/20 !text-white rounded-xl px-4 py-2" />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300 font-medium">Unit</span>}
          name="unit"
          rules={[{ required: true, message: "Please enter unit" }]}
        >
          <Input
            type="number"
            className="!bg-white/10 border border-white/20 !text-white rounded-xl px-4 py-2"
          />
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 rounded-xl bg-red-600 !text-white font-medium shadow-md hover:bg-red-700 transition"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 rounded-xl bg-blue-800 !text-white font-medium shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </Form>
    </Modal>
  );
};
export default EditSubject