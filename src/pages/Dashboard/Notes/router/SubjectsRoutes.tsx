// src/pages/Dashboard/Notes/router/SubjectsRoutes.tsx
import { Subject } from "../components/Subject";
import AllNotesPage from "../NotesFiles/components/AllNotesPage";
import NoteEditorPage from "../NotesFiles/components/Noteeditorpage";
import SubjectNotesPage from "../NotesFiles/components/Subjectnotespage";


const SubjectsRouter = [
  {
    path: "notes",
    children: [
      {
        // Unified "Study Notes" view — all notes across subjects, filterable by pill
        index: true,
        element: <AllNotesPage />,
      },
      {
        // Manage courses/subjects (create, edit, delete) — no longer the default landing
        path: "subjects",
        element: <Subject />,
      },
      {
        // Browse notes scoped to one subject (linked from the subjects page)
        path: "viewNotes/:subjectId",
        element: <SubjectNotesPage />,
      },
      {
        // Rich-text editor — handles both creating and editing a note
        path: "new",
        element: <NoteEditorPage />,
      },
      {
        path: "note/:noteId",
        element: <NoteEditorPage />,
      },
    ],
  },
];

export default SubjectsRouter;