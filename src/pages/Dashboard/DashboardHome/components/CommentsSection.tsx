import { Input, Button } from "antd";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentOnBlog, replyToComment } from "../api/blog.api";
import type { Comment } from "../interface/Blog.interface";
import { toast } from "sonner";

type Props = {
  blogId: string;
  comments: Comment[];
};

const CommentSection = ({ blogId, comments }: Props) => {
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState<null | { id: string; name: string }>(null);

  const { mutate: commentMutate, isPending: commenting } = useMutation({
    mutationFn: () => commentOnBlog(blogId, { text: inputText }),
    onSuccess: () => {
      setInputText("");
      toast.success("Comment added!");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => toast.error("Failed to comment"),
  });

  const { mutate: replyMutate, isPending: replying } = useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      replyToComment(blogId, commentId, { text }),
    onSuccess: () => {
      setInputText("");
      setReplyTo(null);
      toast.success("Reply added!");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => toast.error("Reply failed"),
  });

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    if (replyTo) {
      replyMutate({ commentId: replyTo.id, text: inputText });
    } else {
      commentMutate();
    }
  };

  return (
    <div className="relative pt-3 pb-16 max-h-[75vh] overflow-y-auto px-2">
      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="text-sm">
            <div className="font-semibold text-gray-800">
              {comment.user?.name ?? "Unknown"}
              <span className="ml-2 text-xs text-gray-400">• just now</span>
            </div>
            <p className="text-gray-700 ml-1">{comment.text}</p>

            {/* Replies */}
            {(comment.replies ?? []).length > 0 && (
              <div className="pl-3 mt-2 border-l-2 border-gray-300 space-y-2">
                {(comment.replies ?? []).map((reply) => (
                  <div key={reply._id} className="ml-2">
                    <span className="font-semibold text-gray-800">
                      {reply.user?.name ?? "Unknown"}
                    </span>{" "}
                    <span className="text-gray-700">{reply.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Trigger */}
            <button
              onClick={() => setReplyTo({ id: comment._id, name: comment.user?.name ?? "Unknown" })}
              className="text-xs text-blue-500 hover:underline ml-1 mt-1"
            >
              Reply
            </button>
          </div>
        ))}
      </div>

      {/* Input Box at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-gray-300 border-t shadow-md">
        {replyTo && (
          <div className="text-xs text-gray-600 mb-1">
            Replying to <span className="font-semibold">{replyTo.name}</span>{" "}
            <button onClick={() => setReplyTo(null)} className="ml-2 text-red-500 hover:underline">
              cancel
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Add a comment..."}
            className="rounded-full"
          />
          <Button
            type="primary"
            icon={<SendHorizonal className="h-4 w-4" />}
            loading={commenting || replying}
            onClick={handleSubmit}
            className="!bg-[#0d0c22]"
          />
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
