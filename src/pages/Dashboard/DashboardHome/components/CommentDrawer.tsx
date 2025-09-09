// src/features/blog/components/CommentDrawer.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import CommentSection from "./CommentsSection";
import type { Blog } from "../interface/Blog.interface";

type Props = {
  open: boolean;
  onClose: () => void;
  blog: Blog;
};

const CommentDrawer = ({ open, onClose, blog }: Props) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 transition-opacity" />

        <div className="fixed inset-0 flex items-end justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="w-full max-h-[70vh] bg-[#0d0c22] text-white rounded-t-2xl shadow-lg overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <h3 className="text-lg font-semibold">Comments</h3>
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Comments Content */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <CommentSection blogId={blog._id} comments={blog.comments} />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommentDrawer;