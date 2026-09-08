import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CloudUpload,
  MapPin,
  Images,
  Eye,
  LoaderCircle,
  X,
} from "lucide-react";
import type {
  CreateEventPayload,
  EventCategory,
  EventMode,
} from "../types/eventsTypes";
import { useCreateEvent } from "../hooks/eventHooks";

/* ── Constants ───────────────────────────────────────────────────── */
const CATEGORIES: EventCategory[] = [
  "Academic",
  "Campus Life",
  "Career",
  "Competition",
  "Social",
  "Cultural",
  "Sports",
  "Other",
];

const MODES: { value: EventMode; label: string }[] = [
  { value: "physical", label: "Physical" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

/* ── Section header with numbered badge ─────────────────────────── */
const SectionHeader = ({
  num,
  label,
  color = "blue",
}: {
  num: number;
  label: string;
  color?: "blue" | "green" | "purple";
}) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-500",
    purple: "bg-purple-600",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`w-7 h-7 rounded-full ${colors[color]} text-white text-xs font-black flex items-center justify-center flex-shrink-0`}
      >
        {num}
      </div>
      <h2 className="text-[15px] font-black text-slate-800 dark:text-white">
        {label}
      </h2>
    </div>
  );
};

/* ── Shared input class ──────────────────────────────────────────── */
const input = `
  w-full bg-white dark:bg-[#1a2235]
  border border-slate-200 dark:border-white/8
  rounded-lg px-3.5 py-2.5
  text-sm text-slate-700 dark:text-white
  placeholder-slate-400 dark:placeholder-white/30
  focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10
  transition-all font-['DM_Sans',sans-serif]
`;

const label =
  "block text-[12px] font-semibold text-slate-600 dark:text-white/60 mb-1.5 font-['DM_Sans',sans-serif]";

/* ═══════════════════════════════════════════════════════════════════
   CREATE EVENT FORM
═══════════════════════════════════════════════════════════════════ */
export const CreateEventForm = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<CreateEventPayload>({
    title: "",
    description: "",
    category: "",
    mode: "physical",
    startTime: "",
    endTime: "",
    location: "",
    onlineLink: "",
    capacity: "",
    image: null,
  });

  const { mutate: create, isPending } = useCreateEvent(() =>
    navigate("/dashboard/events"),
  );

  const set =
    (field: keyof CreateEventPayload) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setForm((p) => ({ ...p, image: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.startTime)
      return;
    create(form);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080E1A] font-['DM_Sans',sans-serif]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7">
        {/* Back */}
        <Link
          to="/dashboard/events"
          className="inline-flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Events
        </Link>

        <h1 className="text-[22px] font-black text-slate-900 dark:text-white mb-7">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* ── LEFT COLUMN ─────────────────────────────────── */}
            <div className="space-y-5">
              {/* ─ 1. Basic Information ─ */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm p-6">
                <SectionHeader num={1} label="Basic Information" color="blue" />

                {/* Title */}
                <div className="mb-4">
                  <label className={label}>Event Title</label>
                  <input
                    value={form.title}
                    onChange={set("title")}
                    placeholder="e.g. Neon Summer Night Festival"
                    className={input}
                    required
                  />
                </div>

                {/* Category + Mode */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={label}>Category</label>
                    <select
                      value={form.category}
                      onChange={set("category")}
                      className={input}
                      required
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={label}>Mode</label>
                    <select
                      value={form.mode}
                      onChange={set("mode")}
                      className={input}
                    >
                      {MODES.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={label}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={set("description")}
                    rows={5}
                    placeholder="Tell your attendees what the event is about..."
                    className={input + " resize-none"}
                    required
                  />
                </div>
              </div>

              {/* ─ 2. Date & Location ─ */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm p-6">
                <SectionHeader num={2} label="Date & Location" color="green" />

                {/* Date row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={label}>Start Time</label>
                    <input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={set("startTime")}
                      className={input}
                      required
                    />
                  </div>
                  <div>
                    <label className={label}>End Time</label>
                    <input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={set("endTime")}
                      className={input}
                    />
                  </div>
                </div>

                {/* Location row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={label}>Venue Name</label>
                    <input
                      value={form.location}
                      onChange={set("location")}
                      placeholder="e.g. Grand City Stadium"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className={label}>Capacity (optional)</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={set("capacity")}
                      placeholder="e.g. 200"
                      min={1}
                      className={input}
                    />
                  </div>
                </div>

                {/* Street address */}
                <div className="mb-4">
                  <label className={label}>Street Address</label>
                  <div className="relative">
                    <input
                      value={form.onlineLink || ""}
                      onChange={set("onlineLink")}
                      placeholder={
                        form.mode === "online"
                          ? "Zoom / Meet link"
                          : "123 Festival Way, Campus City"
                      }
                      className={input}
                    />
                  </div>
                </div>

                {/* Map placeholder */}
                {form.mode !== "online" && (
                  <div className="relative h-32 bg-slate-100 dark:bg-white/4 rounded-xl overflow-hidden border border-slate-200 dark:border-white/8 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin
                        size={24}
                        className="text-slate-300 dark:text-white/20 mx-auto mb-1"
                      />
                      <p className="text-xs text-slate-400 dark:text-white/30">
                        Map preview will appear here
                      </p>
                    </div>
                    {/* Decorative grid */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-slate-400"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN ────────────────────────────────── */}
            <div className="space-y-5">
              {/* ─ Event Media ─ */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Eye size={13} className="text-white" />
                  </div>
                  <h2 className="text-[15px] font-black text-slate-800 dark:text-white">
                    Event Media
                  </h2>
                </div>

                {/* Cover image upload */}
                <p className={label}>Cover Image</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {preview ? (
                  /* Preview */
                  <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-white/8">
                    <img
                      src={preview}
                      alt="Cover"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setForm((p) => ({ ...p, image: null }));
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-medium truncate max-w-[70%]">
                      {form.image?.name}
                    </div>
                  </div>
                ) : (
                  /* Drop zone — matches screenshot */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`
                      mb-4 flex flex-col items-center justify-center gap-2
                      border-2 border-dashed rounded-xl py-8
                      transition-colors cursor-pointer
                      ${
                        isDragging
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/2 hover:border-slate-300 dark:hover:border-white/20"
                      }
                    `}
                    onClick={() => fileRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/8 flex items-center justify-center">
                      <CloudUpload
                        size={20}
                        className="text-slate-400 dark:text-white/30"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-slate-600 dark:text-white/60">
                        Drag &amp; drop your file here
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-white/30 mt-0.5">
                        Supports: JPG, PNG, WEBP (Max 5MB)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileRef.current?.click();
                      }}
                      className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-white/50 hover:border-slate-300 dark:hover:border-white/20 transition-colors bg-white dark:bg-white/4"
                    >
                      Browse Files
                    </button>
                  </div>
                )}

                {/* Gallery selection row — matches screenshot */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/6 mb-5 cursor-pointer hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/8 border border-slate-200 dark:border-white/8 flex items-center justify-center">
                      <Images
                        size={14}
                        className="text-slate-500 dark:text-white/40"
                      />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-700 dark:text-white">
                        Gallery Selection
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-white/30">
                        Upload up to 10 more images
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
                  >
                    <span className="text-base leading-none font-bold">+</span>
                  </button>
                </div>

                {/* Visibility preview — matches screenshot */}
                <div>
                  <p className={label}>Visibility Preview</p>
                  <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-white/6 bg-slate-50 dark:bg-white/2">
                    {/* Mini card preview */}
                    <div className="h-[72px] bg-gradient-to-br from-blue-600 to-purple-600 relative">
                      {preview && (
                        <img
                          src={preview}
                          alt=""
                          className="w-full h-full object-cover opacity-60"
                        />
                      )}
                    </div>
                    <div className="px-3 py-2 space-y-1.5">
                      <div className="h-2 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                      <div className="h-1.5 bg-slate-100 dark:bg-white/6 rounded w-1/2" />
                      <div className="flex gap-1.5 pt-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit bar ──────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-6 bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm px-6 py-4">
            <p className="text-xs text-slate-400 dark:text-white/30 font-medium">
              Fields marked * are required
            </p>
            <div className="flex gap-3">
              <Link to="/dashboard/events">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 text-sm font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/4 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-60"
              >
                {isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  "Publish Event"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
