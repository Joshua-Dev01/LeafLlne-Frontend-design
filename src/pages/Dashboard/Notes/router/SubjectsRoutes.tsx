// src/pages/Dashboard/Notes/router/SubjectsRoutes.tsx
import { AddNotes } from "../AddNotes/AddNotes";
import { Subject } from "../components/Subject";
import ViewNotePage from "../NotesFiles/components/ViewNote";

const SubjectsRouter = [
  {
    path: "notes",
    children: [
      {
        index: true,
        element: <Subject />,
      },
      {
        path: "addNotes",
        element: <AddNotes />,
      },

      {
        path: "viewNotes/:subjectId",
        element: <ViewNotePage />,
      },
    ],
  },
];

export default SubjectsRouter;
