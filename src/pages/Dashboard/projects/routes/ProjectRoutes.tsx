import ProjectsWrapper from "../ProjectsWrapper";
import ProjectDetailPage from "../detail/ProjectDetailPage";

const ProjectRouter = [
  {
    path: "projects", // /dashboard/projects
    element: <ProjectsWrapper />,
  },
  {
    path: "projects/:projectId", // /dashboard/projects/:projectId
    element: <ProjectDetailPage />,
  },
];

export default ProjectRouter;
