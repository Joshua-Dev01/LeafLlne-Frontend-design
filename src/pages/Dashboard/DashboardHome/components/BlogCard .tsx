import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Blog } from "../interface/Blog.interface";

type Props = {
  blog: Blog;
  onLike: (id: string) => void;
};

// Temporary wrapper to demo grid here directly
const BlogCard = ({ blog, onLike }: Props) => {
  return (
    
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w- h-40 object-fit rounded-md mb-4"
        />
        <div className="mb-2 text-sm text-gray-500">{blog.category}</div>
        <h2 className="text-lg font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-700 line-clamp-3 text-sm">{blog.content}</p>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>By {blog.author.name}</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(blog._id)}
              className="flex items-center space-x-1 hover:text-red-600"
            >
              <Heart className="w-4 h-4" />
              <span>{blog.likes.length}</span>
            </button>
            <Link
              to={`/app/blog/${blog._id}`}
              className="flex items-center space-x-1 hover:text-blue-600"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{blog.comments.length}</span>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default BlogCard;
