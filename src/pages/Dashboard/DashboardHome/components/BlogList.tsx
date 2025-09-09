// src/components/BlogList.tsx
import type { Blog } from "../interface/Blog.interface";
import BlogCard from "./BlogCard ";

type Props = {
  blogs: Blog[];
  onLike: (id: string) => void;
};

const BlogList = ({ blogs, onLike }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} onLike={onLike} />
      ))}
    </div>
  );
};

export default BlogList;
