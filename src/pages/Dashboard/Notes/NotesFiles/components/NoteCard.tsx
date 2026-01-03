// src/features/notes/components/NoteCard.tsx
import { motion } from "framer-motion";
import { Menu, Trash2, Edit3, Eye } from "lucide-react";
import type { Note } from "../interface/notes";
import { Card, CardContent } from "../../../../../components/ui/card";
import { formatBytes } from "../utilities/formatBytes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { Button } from "../../../../../components/ui/button";

type Props = {
  note: Note;
  onView: (id: string) => void;
  onEdit?: (note: Note) => void;
  onDelete: (id: string) => void;
};

const getIconForNote = (note: Note) => {
  const mime = note.fileMimeType?.toLowerCase() || "";
  const type = note.fileType?.toLowerCase() || "";

  if (mime.includes("pdf")) return "📄";
  if (mime.includes("word") || mime.includes("officedocument")) return "📝";
  if (mime.includes("spreadsheet") || mime.includes("excel")) return "📊";
  if (mime.includes("image") || type === "image") return "🖼️";
  if (mime.includes("zip") || type === "file") return "📦";
  if (mime.includes("video") || type === "video") return "🎬";
  return "📁";
};

export default function NoteCard({ note, onView, onEdit, onDelete }: Props) {
  return (
    <motion.div layout whileHover={{ y: -4 }} className="w-full">
      <Card className="rounded-xl shadow-sm hover:shadow-md transition">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            {/* left: icon & info */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-md bg-white/5 p-3 grid place-items-center text-2xl w-16 h-16">
                {getIconForNote(note)}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {note.description || "No description"}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>{formatBytes(note.fileSize)}</span>
                  <span>•</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* right: actions */}
            <div className="flex flex-col items-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="p-1">
                    <Menu className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onView(note._id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View
                  </DropdownMenuItem>

                  {onEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit(note)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => onDelete(note._id)}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => onView(note._id)}
                className="text-xs text-blue-500 hover:underline mt-2"
              >
                Preview
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
