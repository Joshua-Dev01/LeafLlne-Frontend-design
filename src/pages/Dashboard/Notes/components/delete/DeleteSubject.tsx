import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubjectApi } from "../../api/subject.api";
import type { Subject } from "../../types/Note";

interface Props {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
}

const DeleteSubjectModal: React.FC<Props> = ({ open, onClose, subject }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSubjectApi(subject?._id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="!p-0 custom-dark-modal"
      closeIcon={<span className="text-gray-400 hover:text-white">✕</span>}
    >
      <div className="bg-gradient-to-b from-[#2b2d31] to-[#1e1f22] text-white rounded-2xl p-8 shadow-2xl border border-white/10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <ExclamationCircleOutlined
            style={{
              fontSize: 56,
              color: "#f87171",
              filter: "drop-shadow(0 0 8px rgba(248,113,113,0.8))",
            }}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Delete {subject?.name}?
        </h2>
        <p className="text-gray-400 text-center mb-6">
          This action cannot be undone. This will permanently delete{" "}
          <span className="text-white font-semibold">{subject?.name}</span>.
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onClose}
            className="!bg-[#4f545c] !text-white hover:!bg-[#5b5f67] px-6 py-2 rounded-lg shadow-md"
          >
            Cancel
          </Button>
          <Button
            danger
            type="primary"
            onClick={() => mutate()}
            loading={isPending}
            className="!bg-[#d83c3e] hover:!bg-[#a12d2f] px-6 py-2 rounded-lg shadow-md"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteSubjectModal;
