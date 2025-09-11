import { useState } from "react";
import { Modal, Form, InputNumber, Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import type { CreateSubjectPayload } from "../../types/Note";
import { addSubjectApi } from "../../api/subject.api";
import { handleResponse } from "../../../../../utils/handleErrors";
import AddButton from "../../../../../components/Button/Button";
import { Input } from "../../../../../components/ui/input";

interface AddSubjectModalProps {
  onSuccess?: () => void;
}

const AddSubjectModal = ({ onSuccess }: AddSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateSubjectPayload>();

  const { mutate, isPending } = useMutation({
    mutationFn: addSubjectApi,
    onSuccess: () => {
      handleResponse({
        successMsg: "Subject added successfully",
        successCondition: true,
      });
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
        title={<span className="text-white">Add New Subject</span>}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setOpen(false)}
            className="!bg-red-800 hover:!bg-red-700 !text-white !px-10"
          >
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            loading={isPending}
            onClick={() => form.submit()}
            className="!bg-blue-900 hover:!bg-blue-700 !text-white !px-10"
          >
            Add
          </Button>,
        ]}
        className="custom-dark-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={<span className="text-gray-300">Subject Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter subject name" }]}
          >
            <Input
              placeholder="e.g., Mathematics"
              className="!bg-[#1f1f1f] !text-white"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-300">Course Code</span>}
            name="code"
            rules={[{ required: true, message: "Please enter course code" }]}
          >
            <Input
              placeholder="e.g., MATH201"
              className="!bg-[#1f1f1f] !text-white"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-300">Unit</span>}
            name="unit"
            rules={[{ required: true, message: "Please enter unit" }]}
          >
            <Input
              type="number"
              placeholder="e.g., 3"
              className="bg-[#1f1f1f] !text-white placeholder:text-gray-400"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddSubjectModal;
