// 🔹 Shared User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string; // profile picture id (optional but supported)
}

// 🔹 Task interface (embedded inside Project)
export interface Task {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: User | null; // null allowed (matches API)
}

// 🔹 Project interface (MAIN)
export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  collaborators: User[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}


export interface CreateProjectPayload {
    title: string;
    description?: string;
}





export interface ProjectsResponse {
    total: number;
    page: number;
    pages: number;
    projects: Project[];
}
