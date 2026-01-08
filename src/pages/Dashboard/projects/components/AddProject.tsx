import { useState } from "react";
import { Modal, Input, Button, Form, Spin } from "antd";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectPayload } from "../interface/ProjectType";
import { createProjectApi } from "../api/Project";
import { handleResponse } from "../../../../utils/handleErrors";

export const AddProjectModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm<CreateProjectPayload>();
  const queryClient = useQueryClient();

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      handleResponse({
        successMsg: "Project created successfully 🎉",
        successCondition: true,
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.resetFields();
      setError(null);
      setIsModalVisible(false);
    },
    onError: (error) => {
      const msg =
        error instanceof Error
          ? error.message
          : String(error || "Failed to create project");
      setError(msg);
      handleResponse({ error });
    },
  });

  const handleSubmit = (values: CreateProjectPayload) => {
    mutate(values);
  };

  return (
    <>
      {/* Button to open modal */}
      <Button
        onClick={() => setIsModalVisible(true)}
        className="flex items-center gap-2 !bg-indigo-950 !py-5 !text-white"
      >
        <PlusCircle className="h-5 w-5" />
        Add Project
      </Button>

      {/* Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        styles={{
          content: { backgroundColor: "#374151" }, // gray-700
          body: { backgroundColor: "#374151", padding: "2rem" },
        }}
      >
        <div className="flex flex-col gap-4">
          <p className="!text-xl !font-bold !text-gray-900 dark:!text-gray-100 flex items-center gap-2">
            <PlusCircle className="h-6 w-6 !text-indigo-600" /> Add New Project
          </p>
          <p className="!text-sm !text-gray-500 dark:!text-gray-400">
            Fill in the details below to create a new project.
          </p>

          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            className="mt-3"
          >
            <Form.Item
              label="Project Title"
              name="title"
              rules={[{ required: true, message: "Project title is required" }]}
            >
              <Input
                placeholder="Enter project title"
                disabled={isPending}
                className="!rounded-md !bg-gray-300 !py-3"
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                placeholder="Optional project description"
                disabled={isPending}
                className="!rounded-md !bg-gray-300 "
                rows={4}
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                className="!w-full !flex !justify-center !py-5 items-center !gap-2 !bg-indigo-950 hover:bg-indigo-800 !text-[19px] !text-white"
                disabled={isPending}
              >
                {isPending ? <Spin size="small" /> : " Create Project"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
