import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Reply, Send, X, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import type { Comment } from "../types/eventsTypes";
import {
  addCommentApi,
  deleteCommentApi,
  getCommentsApi,
  getRepliesApi,
  toggleCommentLikeApi,
} from "../apis/eventsApi";

interface Props {
  eventId: string;
  currentUserId: string;
  open: boolean;
  onClose: () => void;
}

/* ── Single Comment Row ─────────────────────────────────────────── */
const CommentRow = ({
  comment,
  eventId,
  currentUserId,
  depth = 0,
}: {
  comment: Comment;
  eventId: string;
  currentUserId: string;
  depth?: number;
}) => {
  const qc = useQueryClient();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const isLiked = comment.likes.includes(currentUserId);
  const isOwner = comment.userId === currentUserId;

  /* Fetch replies */
  const { data: repliesData, isLoading: repliesLoading } = useQuery({
    queryKey: ["replies", comment.id],
    queryFn: () => getRepliesApi(eventId, comment.id),
    enabled: showReplies,
    staleTime: 30_000,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleCommentLikeApi(eventId, comment.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", eventId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCommentApi(eventId, comment.id),
    onSuccess: () => {
      toast.success("Comment deleted");
      qc.invalidateQueries({ queryKey: ["comments", eventId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: () =>
      addCommentApi(eventId, { text: replyText, parentId: comment.id }),
    onSuccess: () => {
      toast.success("Reply added");
      setReplyText("");
      setReplyOpen(false);
      setShowReplies(true);
      qc.invalidateQueries({ queryKey: ["replies", comment.id] });
      qc.invalidateQueries({ queryKey: ["comments", eventId] });
    },
    onError: () => toast.error("Failed to add reply"),
  });

  const avatar = comment.userAvatar;
  const initials = comment.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${depth > 0 ? "ml-8 pl-4 border-l-2 border-slate-100 dark:border-white/8" : ""}`}
    >
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={comment.userName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0A1931] dark:bg-blue-900 flex items-center justify-center text-white text-[10px] font-bold font-['DM_Sans',sans-serif]">
              {initials}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-semibold text-slate-800 dark:text-white font-['DM_Sans',sans-serif]">
              {comment.userName}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-white/30 font-['DM_Sans',sans-serif]">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-white/70 font-['DM_Sans',sans-serif] leading-relaxed break-words">
            {comment.text}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => likeMutation.mutate()}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors font-['DM_Sans',sans-serif] ${
                isLiked
                  ? "text-red-500"
                  : "text-slate-400 dark:text-white/30 hover:text-red-400"
              }`}
            >
              <Heart size={13} className={isLiked ? "fill-current" : ""} />
              {comment.likes.length > 0 && comment.likes.length}
            </button>

            {depth === 0 && (
              <button
                onClick={() => setReplyOpen((p) => !p)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-white/30 hover:text-[#0A1931] dark:hover:text-white transition-colors font-['DM_Sans',sans-serif]"
              >
                <Reply size={13} />
                Reply
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-white/30 hover:text-red-500 transition-colors font-['DM_Sans',sans-serif]"
              >
                <Trash2 size={13} />
              </button>
            )}

            {/* Show replies toggle */}
            {depth === 0 && (comment.replyCount ?? 0) > 0 && (
              <button
                onClick={() => setShowReplies((p) => !p)}
                className="flex items-center gap-1 text-xs font-semibold text-[#0A1931] dark:text-blue-400 font-['DM_Sans',sans-serif]"
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform ${showReplies ? "rotate-180" : ""}`}
                />
                {comment.replyCount}{" "}
                {comment.replyCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {/* Reply input */}
          {replyOpen && (
            <div className="flex gap-2 mt-3">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#0A1931]/30 font-['DM_Sans',sans-serif]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && replyText.trim())
                    replyMutation.mutate();
                }}
              />
              <button
                onClick={() => replyText.trim() && replyMutation.mutate()}
                disabled={replyMutation.isPending || !replyText.trim()}
                className="w-9 h-9 flex items-center justify-center bg-[#0A1931] text-white rounded-xl disabled:opacity-40 transition-opacity"
              >
                <Send size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {showReplies && (
        <div>
          {repliesLoading && (
            <div className="ml-8 pl-4 space-y-2 py-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-slate-100 dark:bg-white/5 rounded animate-pulse"
                />
              ))}
            </div>
          )}
          {repliesData?.replies?.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              eventId={eventId}
              currentUserId={currentUserId}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Comments Panel ────────────────────────────────────────── */
export const EventComments = ({
  eventId,
  currentUserId,
  open,
  onClose,
}: Props) => {
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["comments", eventId],
    queryFn: () => getCommentsApi(eventId),
    enabled: open,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: () => addCommentApi(eventId, { text }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["comments", eventId] });
    },
    onError: () => toast.error("Failed to post comment"),
  });

  if (!open) return null;

  const comments = data?.comments ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:w-[420px] h-[85vh] sm:h-full sm:max-h-[700px] flex flex-col bg-white dark:bg-[#0F1A2E] sm:rounded-2xl rounded-t-2xl shadow-2xl border border-slate-100 dark:border-white/8 sm:mr-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8 flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white font-['DM_Sans',sans-serif]">
              Discussion
            </h3>
            <p className="text-xs text-slate-400 dark:text-white/30 font-['DM_Sans',sans-serif]">
              {data?.total ?? 0} comments
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500 dark:text-white/40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 divide-y divide-slate-50 dark:divide-white/4">
          {isLoading && (
            <div className="space-y-4 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/8 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && comments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-slate-400 dark:text-white/30 text-sm font-['DM_Sans',sans-serif]">
                No comments yet. Be the first!
              </p>
            </div>
          )}

          {comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              eventId={eventId}
              currentUserId={currentUserId}
            />
          ))}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 dark:border-white/8">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#0A1931]/20 dark:focus:ring-white/10 font-['DM_Sans',sans-serif]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) addMutation.mutate();
              }}
            />
            <button
              onClick={() => text.trim() && addMutation.mutate()}
              disabled={addMutation.isPending || !text.trim()}
              className="w-10 h-10 flex items-center justify-center bg-[#0A1931] hover:bg-[#0d2240] text-white rounded-xl disabled:opacity-40 transition-all flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
