import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NotesGrid from "./NotesGrid";
import AddNoteModal from "./Addnotemodal";

export default function SubjectNotesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  if (!subjectId) {
    return <div className="text-center text-neutral-400 py-10">No subject selected.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/notes"
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to subjects
        </Link>
        <AddNoteModal subjectId={subjectId} />
      </div>

      <NotesGrid subjectId={subjectId} />
    </div>
  );
}