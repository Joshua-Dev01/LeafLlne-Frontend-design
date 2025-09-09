export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface Comment {
  _id: string;
  user: Author;
  text: string;
  replies?: Comment[];
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  category: string;
  author: Author;
  likes: string[]; // list of userIds who liked
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  blogs: Blog[];
  total: number;
}

export interface LikeResponse {
  message: string;
  liked: boolean;
  totalLikes: number;
}

export interface CommentPayload {
  text: string;
}

export interface ReplyPayload {
  commentId: string;
  text: string;
}
