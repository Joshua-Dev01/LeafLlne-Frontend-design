import { useQuery } from "@tanstack/react-query";
import { getAllBlogs } from "../api/blog.api";


export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => await getAllBlogs(),
  });
};
