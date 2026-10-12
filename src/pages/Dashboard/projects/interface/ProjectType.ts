export type ProjectColor =
  | "violet"
  | "indigo"
  | "sky"
  | "teal"
  | "emerald"
  | "amber"
  | "rose"
  | "fuchsia";

export type ProjectIconKey =
  | "folder"
  | "rocket"
  | "flask"
  | "code"
  | "book"
  | "palette"
  | "calculator"
  | "globe"
  | "microscope"
  | "briefcase"
  | "scale"
  | "heart"
  | "cpu"
  | "lightbulb";

export type Visibility = "private" | "team";
export type TaskStatus = "not-started" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Person {
  _id: string;
  name: string;
  picture?: string | null;
}

export interface Member extends Person {
  role: "owner" | "member";
  isMe: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  percent: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  color: ProjectColor;
  icon: ProjectIconKey;
  visibility: Visibility;
  startDate: string | null;
  deadline: string | null;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  owner: Person | null;
  members: Member[];
  role: "owner" | "member";
  stats: TaskStats;
  status: TaskStatus; // derived from the tasks
}

export interface ProjectCounts {
  all: number;
  mine: number;
  team: number;
  archived: number;
}

export interface ProjectsResponse {
  total: number;
  page: number;
  pages: number;
  counts: ProjectCounts;
  projects: Project[];
}

export interface ProjectLimit {
  used: number;
  max: number | null; // null = unlimited
  plan: string;
}

export interface ProjectSummary {
  total: number;
  inProgress: number;
  completed: number;
  notStarted: number;
  upcomingDeadlines: number;
  nextDeadline: { title: string; deadline: string } | null;
  limit: ProjectLimit;
}

export interface ListParams {
  tab?: "all" | "mine" | "team" | "archived";
  q?: string;
  category?: string;
  status?: TaskStatus | "";
  deadline?: "overdue" | "7d" | "30d" | "none" | "";
  sort?: "recent" | "deadline" | "progress" | "title";
  page?: number;
  limit?: number;
}

export interface Subtask {
  _id: string;
  title: string;
  done: boolean;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: Person | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  subtasks: Subtask[];
  completedAt: string | null;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  assignedTo?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  subtasks?: string[];
}

export interface PendingInvitation {
  _id: string;
  createdAt: string;
  invitee: Person | null;
}

export interface ProjectDetailResponse {
  project: Project;
  pendingInvitations: PendingInvitation[];
}

export interface MyInvitation {
  _id: string;
  createdAt: string;
  project: { _id: string; title: string; category: string; color: ProjectColor; icon: ProjectIconKey };
  inviter: Person | null;
}

export interface UserSearchResult extends Person {
  emailHint: string;
}

export interface CommentItem {
  _id: string;
  body: string;
  createdAt: string;
  author: Person | null;
  canDelete: boolean;
}

export interface ActivityItem {
  _id: string;
  type: string;
  text: string;
  createdAt: string;
  actor: Person | null;
}

export interface ProjectFileItem {
  _id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  createdAt: string;
  uploader: Person | null;
  canDelete: boolean;
}

export interface ProjectFormValues {
  title: string;
  description: string;
  category: string;
  startDate: string; // yyyy-MM-dd or ""
  deadline: string;
  visibility: Visibility;
  color: ProjectColor;
  icon: ProjectIconKey;
}

export interface PagedComments {
  total: number;
  page: number;
  pages: number;
  comments: CommentItem[];
}

export interface PagedActivity {
  total: number;
  page: number;
  pages: number;
  activity: ActivityItem[];
}
