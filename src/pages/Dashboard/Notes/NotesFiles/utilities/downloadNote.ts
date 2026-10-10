// src/pages/Dashboard/Notes/NotesFiles/utils/downloadNote.ts
import type { Note } from "../interface/notes";

const slugifyFileName = (title: string) =>
  (title || "untitled-note").trim().replace(/[^a-z0-9\-_ ]/gi, "").replace(/\s+/g, "-").toLowerCase();

const triggerBlobDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/**
 * Downloads the note's rich-text content as a standalone, self-contained
 * .html file — works for every note regardless of whether it has an
 * attached file, since `content` is the actual body of the note.
 */
export const downloadNoteContent = (note: Note) => {
  const subject = typeof note.subjectId === "object" ? note.subjectId : undefined;
  const tags = (note.tags ?? []).map((t) => `#${t}`).join(" ");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${note.title}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 720px; margin: 48px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .meta { color: #888; font-size: 13px; margin-bottom: 24px; }
  .tags { color: #4b0082; font-size: 13px; margin-bottom: 24px; }
  hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
</style>
</head>
<body>
  <h1>${note.title}</h1>
  <div class="meta">
    ${subject ? `${subject.name}${subject.code ? ` · ${subject.code}` : ""} — ` : ""}Last updated ${new Date(note.updatedAt).toLocaleString()}
  </div>
  ${tags ? `<div class="tags">${tags}</div>` : ""}
  <hr />
  ${note.content || "<p><em>This note has no content.</em></p>"}
</body>
</html>`;

  triggerBlobDownload(new Blob([html], { type: "text/html" }), `${slugifyFileName(note.title)}.html`);
};

/**
 * Downloads the note's attached file (if any) by fetching it as a blob first,
 * so the browser is forced to save it rather than navigating to it — works
 * even when the host doesn't send a Content-Disposition: attachment header.
 * Falls back to opening the file in a new tab if the fetch is blocked (e.g. CORS).
 */
export const downloadNoteAttachment = async (note: Note) => {
  if (!note.fileUrl) return;
  try {
    const res = await fetch(note.fileUrl);
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const ext = note.fileUrl.split(".").pop()?.split("?")[0] || "";
    const fileName = `${slugifyFileName(note.title)}${ext ? `.${ext}` : ""}`;
    triggerBlobDownload(blob, fileName);
  } catch {
    window.open(note.fileUrl, "_blank", "noopener,noreferrer");
  }
};