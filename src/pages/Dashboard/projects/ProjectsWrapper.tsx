import { ProjectSearchBar } from "./components/ProjectSearchBar";
import { ProjectsGrid } from "./components/ProjectGrid";
import { AddProjectModal } from "./components/AddProject";

const ProjectsWrapper = () => {
  return (
    <>
      <div className="font-sans">
        <div className="flex item-center justify-between mb-5">
          <p className="text-2xl font-bold ">Projects</p>
          <AddProjectModal />
        </div>

        <div>
          <ProjectSearchBar />
        </div>

        <div>
          <ProjectsGrid />
        </div>
      </div>
    </>
  );
};

export default ProjectsWrapper;
