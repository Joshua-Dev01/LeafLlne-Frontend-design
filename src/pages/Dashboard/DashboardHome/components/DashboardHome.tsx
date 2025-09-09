import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBlogs } from "../hooks/useBlogs";
import { likeBlog } from "../api/blog.api"; import { Skeleton, Button } from "antd";
import { MessageCircle, Heart } from "lucide-react";
import { useState } from "react";
import type { Blog } from "../interface/Blog.interface";
import { IoMdHeart } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { handleResponse } from "../../../../utils/handleErrors";
import CommentDrawer from "./CommentDrawer";
import { FaDownload } from "react-icons/fa";

const DashboardHome = () => {
  const queryClient = useQueryClient();
  const { data: blogs, isLoading, isError } = useBlogs();
  const [expandedComments, setExpandedComments] = useState<string | null>(null);

  const userId = localStorage.getItem("leafline_user_id") || "";

  const { mutate: likeBlogMutate } = useMutation({
    mutationFn: likeBlog,

    // Optimistic UI
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["blogs"] });

      const previousData = queryClient.getQueryData<Blog[]>(["blogs"]);

      queryClient.setQueryData<Blog[]>(["blogs"], (old) =>
        old?.map((blog) =>
          blog._id === id
            ? {
              ...blog,
              likes: blog.likes.includes(userId)
                ? blog.likes.filter((uid) => uid !== userId)
                : [...blog.likes, userId],
            }
            : blog
        )
      );

      return { previousData };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(["blogs"], context?.previousData);
      handleResponse({ error });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const handleLike = (id: string) => {
    likeBlogMutate(id);
  };

  const toggleComments = (blogId: string) => {
    setExpandedComments((prev) => (prev === blogId ? null : blogId));
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded shadow bg-white space-y-4">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center font-semibold text-red-600">
        Failed to load blogs. Please try again.
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <img
          src="/empty-blog.png"
          alt="No blogs"
          className="w-40 h-40 mb-6 opacity-70"
        />
        <h2 className="text-xl font-semibold mb-2">No Blogs Available</h2>
        <p className="text-sm text-gray-400">
          When blogs are created, they’ll show up here.
        </p>
      </div>
    );
  }

  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
  {blogs.map((blog: Blog) => {
    const isLiked = blog.likes.includes(userId);

    return (
         <div
        key={blog._id}
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row transition hover:shadow-lg"
        style={{ minHeight: "320px" }}
      >
        {/* Image Section */}
        <div className="relative w-full sm:w-1/2 flex flex-col p5">
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Best Seller
          </span>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-60 object-fit sm:h-full"
          />

          {/* Like & Comment under image */}
          <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t mt-auto">
            {/* Like Button */}
            <AnimatePresence mode="wait" initial={false}>
              <Button
                key={isLiked ? "liked" : "not-liked"}
                type="text"
                icon={
                  isLiked ? (
                    <motion.span
                      key="filled"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [1.2, 0.95, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <IoMdHeart className="text-red-500 text-2xl" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="outline"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className="text-gray-500" />
                    </motion.span>
                  )
                }
                onClick={() => handleLike(blog._id)}
              >
                {blog.likes.length}
              </Button>
            </AnimatePresence>

            {/* Comment Button */}
            <Button
              type="text"
              icon={<MessageCircle />}
              onClick={() => toggleComments(blog._id)}
            >
              {blog.comments.length}
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between sm:w-1/2">
          <div>
            <h3 className="text-lg font-semibold">{blog.title}</h3>
            <p className="text-gray-500 text-sm mb-2">Business & Money</p>

            {/* Ratings */}
            <div className="flex items-center mb-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-4 h-4 text-yellow-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.05 3.233a1 1 0 00.95.69h3.396c.969 0 1.371 1.24.588 1.81l-2.748 1.996a1 1 0 00-.364 1.118l1.05 3.233c.3.921-.755 1.688-1.54 1.118l-2.748-1.996a1 1 0 00-1.176 0l-2.748 1.996c-.784.57-1.838-.197-1.539-1.118l1.05-3.233a1 1 0 00-.364-1.118L2.914 8.66c-.783-.57-.38-1.81.588-1.81h3.396a1 1 0 00.95-.69l1.05-3.233z" />
                  </svg>
                ))}
            </div>

            {/* Price */}
            <p className="text-green-600 font-semibold mb-4">$22.00</p>
          </div>

          {/* Add to Cart */}
          <Button className="bg-black text-white px-4 py-2 rounded-full">
            <FaDownload />
          </Button>
        </div>

        {/* Comment Drawer */}
        <CommentDrawer
          open={expandedComments === blog._id}
          onClose={() => setExpandedComments(null)}
          blog={blog}
        />
      </div>
    );
  })}
</div>

  );
};

export default DashboardHome;
