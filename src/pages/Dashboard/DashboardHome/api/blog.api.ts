import { apiGet, apiPost } from "../../../../services/apiCall";
import type {
  Blog,
  CommentPayload,
  LikeResponse,
} from "../interface/Blog.interface";

// Fetch all blogs
export const getAllBlogs = async (): Promise<Blog[]> => {
  return await apiGet<Blog[]>("/blog/get-blog");
};

// Fetch a single blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  return await apiGet<Blog>(`/blog/${id}`);
};

// Like a blog
export const likeBlog = async (blogId: string): Promise<LikeResponse> => {
  return await apiPost<LikeResponse, null>(`/blog/${blogId}/like`, null);
};

// Add a comment to a blog
export const commentOnBlog = async (
  blogId: string,
  payload: CommentPayload
) => {
  return await apiPost(`/blog/${blogId}/comment`, payload);
};

// Reply to a comment
export const replyToComment = async (
  blogId: string,
  commentId: string,
  payload: CommentPayload
) => {
  return await apiPost(`/blog/${blogId}/comment/${commentId}/reply`, payload);
};

// Search blogs by query
export const searchBlogs = async (query: string): Promise<Blog[]> => {
  return await apiGet<Blog[]>(`/blog/search/query?q=${query}`);
};
