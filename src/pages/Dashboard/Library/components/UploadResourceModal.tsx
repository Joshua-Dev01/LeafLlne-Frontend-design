import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { CloudUpload, FileText, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../../lib/utils";
import { useLibraryFilters, useUploadResource } from "../hooks/libraryHooks";
import type { ResourceCategory } from "../types/libraryTypes";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME,
  CATEGORY_META,
  CATEGORY_ORDER,
  LEVELS,
  MAX_FILE_BYTES,
  formatBytes,
} from "../utils/libraryUtils";
import {
  CloseButton,
  GhostButton,
  ModalShell,
  PrimaryButton,
  fieldClass,
} from "./LibraryBits";

const MAX_TAGS = 8;
const DESC_MAX = 300;

const Label = ({
  children,
  required,
  right,
}: {
  children: React.ReactNode;
  required?: boolean;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-1">
    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </span>
    {right}
  </div>
);

const validateFile = (f: File): string | null => {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  const okExt = ACCEPTED_EXTENSIONS.split(",").includes(`.${ext}`);
  if (!ACCEPTED_MIME.has(f.type) && !okExt)
    return "Unsupported file. Upload a PDF, Word, PowerPoint, Excel, text or image file.";
  if (f.size > MAX_FILE_BYTES)
    return `File is too large. Maximum size is ${MAX_FILE_BYTES / (1024 * 1024)}MB.`;
  return null;
};

export const UploadResourceModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: filters } = useLibraryFilters();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("study-material");
  const [courseCode, setCourseCode] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [session, setSession] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [allowDownload, setAllowDownload] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);

  const reset = () => {
    setFile(null);
    setFileError("");
    setTitle("");
    setDescription("");
    setCategory("study-material");
    setCourseCode("");
    setSubject("");
    setDepartment("");
    setLevel("");
    setSession("");
    setTags([]);
    setTagInput("");
    setAllowDownload(true);
    setConfirmed(false);
    setTouched(false);
  };

  const close = () => {
    if (upload.isPending) return;
    reset();
    onClose();
  };

  const upload = useUploadResource(() => {
    reset();
    onClose();
  });

  const pickFile = (f?: File | null) => {
    if (!f) return;
    const err = validateFile(f);
    setFileError(err ?? "");
    if (err) {
      setFile(null);
      return;
    }
    setFile(f);
    // Pre-fill the title from the file name to save a step.
    if (!title.trim()) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const addTag = (raw: string) => {
    const t = raw.trim().replace(/^#+/, "").toLowerCase();
    if (!t || tags.includes(t) || tags.length >= MAX_TAGS) return;
    setTags((x) => [...x, t]);
  };

  const onTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((x) => x.slice(0, -1));
    }
  };

  const problems = {
    file: !file,
    title: title.trim().length < 3,
    description: description.trim().length === 0,
    courseCode: courseCode.trim().length === 0,
    confirmed: !confirmed,
  };
  const valid = !Object.values(problems).some(Boolean);

  const submit = () => {
    setTouched(true);
    if (!valid || !file) {
      if (problems.file) setFileError("Choose a file to upload.");
      return;
    }
    const pendingTag = tagInput.trim();
    const finalTags =
      pendingTag && !tags.includes(pendingTag.toLowerCase()) && tags.length < MAX_TAGS
        ? [...tags, pendingTag.replace(/^#+/, "").toLowerCase()]
        : tags;
    upload.mutate(
      {
        file,
        title,
        description,
        category,
        courseCode,
        subject,
        department,
        level,
        session: category === "past-question" ? session : "",
        tags: finalTags,
        allowDownload,
      },
      { onError: () => toast.dismiss() },
    );
  };

  const err = (show: boolean) =>
    touched && show ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "";

  return (
    <ModalShell open={open} onClose={close} className="sm:max-w-3xl">
      <div className="flex items-start justify-between gap-3 p-5 pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <div>
          <h2 className="font-semibold text-lg text-neutral-900 dark:text-white">
            Share a resource
          </h2>
          <p className="text-sm text-neutral-500">
            Uploads are reviewed by a moderator before they appear in the Library.
          </p>
        </div>
        <CloseButton onClick={close} />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Dropzone */}
        {file ? (
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/20 dark:text-[#d9b8ff]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500 font-mono">{formatBytes(file.size)}</p>
              {upload.isPending && (
                <div className="mt-2 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-[#4b0082] dark:bg-[#9d4edd] transition-all"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
            </div>
            {!upload.isPending && (
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => setFile(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-[#262525] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition",
              dragging
                ? "border-violet-500 bg-violet-50 dark:bg-[#9d4edd]/10"
                : "border-neutral-300 dark:border-neutral-700 hover:border-violet-400",
              touched && problems.file && "border-red-400",
            )}
          >
            <CloudUpload className="w-8 h-8 mx-auto text-[#4b0082] dark:text-[#d9b8ff]" />
            <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
              Drag a file here, or click to browse
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              PDF, Word, PowerPoint, Excel, text or image · up to{" "}
              {MAX_FILE_BYTES / (1024 * 1024)}MB
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          hidden
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {fileError && <p className="text-xs text-red-500 -mt-3">{fileError}</p>}

        {/* Metadata */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label required>Resource title</Label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              placeholder="e.g. Introduction to Computer Science — Lecture Notes"
              className={cn(fieldClass, err(problems.title))}
            />
          </div>

          <div className="sm:col-span-2">
            <Label
              required
              right={
                <span className="text-[11px] font-mono text-neutral-400">
                  {description.length} / {DESC_MAX}
                </span>
              }
            >
              Short description
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              rows={3}
              placeholder="What does this cover? Who is it useful for?"
              className={cn(
                fieldClass,
                "h-auto py-2 resize-none",
                err(problems.description),
              )}
            />
          </div>

          <div>
            <Label required>Resource category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              className={cn(fieldClass, "cursor-pointer")}
            >
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label required>Course code</Label>
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              maxLength={20}
              list="library-course-codes"
              placeholder="e.g. CSC 201"
              className={cn(fieldClass, "uppercase placeholder:normal-case", err(problems.courseCode))}
            />
            <datalist id="library-course-codes">
              {filters?.courseCodes.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <Label>Subject</Label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={100}
              list="library-subjects"
              placeholder="e.g. Data Structures & Algorithms"
              className={fieldClass}
            />
            <datalist id="library-subjects">
              {filters?.subjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <Label>Department</Label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              maxLength={100}
              list="library-departments"
              placeholder="e.g. Computer Science"
              className={fieldClass}
            />
            <datalist id="library-departments">
              {filters?.departments.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          <div>
            <Label>Academic level</Label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={cn(fieldClass, "cursor-pointer")}
            >
              <option value="">Not specified</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l} Level
                </option>
              ))}
            </select>
          </div>

          {category === "past-question" && (
            <div>
              <Label>Exam session</Label>
              <input
                value={session}
                onChange={(e) => setSession(e.target.value)}
                maxLength={20}
                placeholder="e.g. 2023/2024"
                className={fieldClass}
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <Label
              right={
                <span className="text-[11px] text-neutral-400">
                  Press enter to add · {tags.length}/{MAX_TAGS}
                </span>
              }
            >
              Tags & topic keywords
            </Label>
            <div
              className={cn(
                fieldClass,
                "h-auto min-h-10 py-1.5 flex flex-wrap items-center gap-1.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20",
              )}
            >
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs bg-violet-100 text-[#4b0082] dark:bg-[#9d4edd]/20 dark:text-[#d9b8ff]"
                >
                  #{t}
                  <button
                    type="button"
                    aria-label={`Remove ${t}`}
                    onClick={() => setTags((x) => x.filter((y) => y !== t))}
                    className="cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagKey}
                onBlur={() => {
                  addTag(tagInput);
                  setTagInput("");
                }}
                disabled={tags.length >= MAX_TAGS}
                placeholder={tags.length ? "" : "+ Add keyword…"}
                className="flex-1 min-w-[100px] bg-transparent outline-none text-sm py-0.5"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allowDownload}
            onChange={(e) => setAllowDownload(e.target.checked)}
            className="mt-1 accent-[#4b0082]"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Allow other students to download this file
            <span className="block text-xs text-neutral-500">
              If off, others can still preview it inside LeafLine.
            </span>
          </span>
        </label>

        <label
          className={cn(
            "flex items-start gap-3 rounded-xl p-3 cursor-pointer bg-neutral-50 dark:bg-[#1a1a1a] border",
            touched && problems.confirmed
              ? "border-red-400"
              : "border-neutral-200 dark:border-neutral-800",
          )}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 accent-[#4b0082]"
          />
          <span className="text-xs text-neutral-600 dark:text-neutral-300">
            I confirm this material doesn’t violate my institution’s honor code or any copyright
            policy, and I have the right to share it.
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 p-5 pt-3 border-t border-neutral-100 dark:border-neutral-900">
        <p className="text-xs text-neutral-500 hidden sm:block">
          {upload.isPending
            ? `Uploading… ${upload.progress}%`
            : file
              ? "Ready to submit"
              : "No file selected"}
        </p>
        <div className="flex gap-2 ml-auto">
          <GhostButton onClick={close} disabled={upload.isPending}>
            Cancel
          </GhostButton>
          <PrimaryButton onClick={submit} disabled={upload.isPending}>
            {upload.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" /> Submit resource
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </ModalShell>
  );
};
