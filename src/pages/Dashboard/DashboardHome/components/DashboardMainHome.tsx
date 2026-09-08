import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, NotepadText, Users } from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { getSubjects } from "../../Notes/api/subject.api";
import { getNotesBySubject } from "../../Notes/NotesFiles/api/notesFlies.api";
import { getAllEventsApi } from "../../Events/apis/eventsApi";
import { getProjectsApi } from "../../projects/api/Project";
import type { Subject } from "../../Notes/types/Note";
import type { Note } from "../../Notes/NotesFiles/interface/notes";
import { useCurrentUser } from "../hooks/Usecurrentuser";

interface RecentNote {
  subject: Subject;
  note: Note | null;
}

const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function DashboardMainHome() {
  const user = useCurrentUser();

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const { data: recentNotes, isLoading: notesLoading } = useQuery({
    queryKey: ["recentNotes", subjects?.map((s) => s._id)],
    enabled: !!subjects && subjects.length > 0,
    queryFn: async (): Promise<RecentNote[]> => {
      const topSubjects = [...(subjects ?? [])]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 2);

      return Promise.all(
        topSubjects.map(async (subject) => {
          try {
            const res = await getNotesBySubject(subject._id, {
              limit: 1,
              sortBy: "updatedAt",
              order: "desc",
            });
            return { subject, note: res.notes[0] ?? null };
          } catch {
            return { subject, note: null };
          }
        })
      );
    },
  });

  const { data: eventsRes, isLoading: eventsLoading } = useQuery({
    queryKey: ["overviewUpcomingEvents"],
    queryFn: () => getAllEventsApi("status=upcoming&limit=3&sort=date"),
  });

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ["overviewProjects"],
    queryFn: () => getProjectsApi("limit=3"),
  });

  const upcomingEvents = eventsRes?.events ?? [];
  const projects = projectsRes?.projects ?? [];

  const totalNotesTracked = subjects?.length ?? 0;
  const completedTasks =
    projects.reduce(
      (sum, p) => sum + p.tasks.filter((t) => t.status === "completed").length,
      0
    ) ?? 0;

  return (
    <div className="w-full space-y-6">
      {/* ===== Welcome banner ===== */}
      <div className="rounded-2xl bg-gradient-to-br from-[#4b0082] to-[#5d1a8e] text-white p-8">
        <h1 className="text-3xl font-semibold">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="mt-2 text-violet-100 max-w-xl text-sm">
          You have {upcomingEvents.length} upcoming event{upcomingEvents.length === 1 ? "" : "s"} and{" "}
          {subjects?.length ?? 0} subject{subjects?.length === 1 ? "" : "s"} on your plate.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <StatChip label="Subjects" value={totalNotesTracked} suffix="" />
          <StatChip label="Completed tasks" value={completedTasks} suffix="" />
          <StatChip label="Deadlines" value={upcomingEvents.length} suffix="due" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Left / main column ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Notes */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Notes</h2>
              <Link to="/dashboard/notes" className="text-sm text-[#7e06da] hover:underline">
                View Library
              </Link>
            </div>

            {subjectsLoading || notesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            ) : !recentNotes || recentNotes.length === 0 ? (
              <EmptyCard
                icon={<NotepadText className="w-5 h-5" />}
                message="No notes yet. Add a subject to start taking notes."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentNotes.map(({ subject, note }) => (
                  <Link
                    key={subject._id}
                    to={`/dashboard/notes/viewNotes/${subject._id}`}
                    className="rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-9 h-9 rounded-lg bg-violet-100 text-[#4b0082] flex items-center justify-center">
                        <NotepadText className="w-[18px] h-[18px]" />
                      </span>
                      <span className="text-xs text-neutral-400">
                        {relativeTime(note?.updatedAt ?? subject.updatedAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      {note?.title ?? subject.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {note?.description ?? `No notes added to ${subject.name} yet.`}
                    </p>
                    <span className="inline-block mt-3 text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      {subject.code}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming Events */}
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">Upcoming Events</h2>
            {eventsLoading ? (
              <Skeleton className="h-32 rounded-xl" />
            ) : upcomingEvents.length === 0 ? (
              <EmptyCard
                icon={<CalendarDays className="w-5 h-5" />}
                message="Nothing on the calendar yet."
              />
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
                {upcomingEvents.map((event) => {
                  const date = new Date(event.date);
                  return (
                    <div key={event.id} className="flex items-center gap-4 p-4">
                      <div className="text-center w-12 shrink-0">
                        <p className="text-[10px] font-medium text-[#4b0082] uppercase">
                          {date.toLocaleDateString(undefined, { month: "short" })}
                        </p>
                        <p className="text-lg font-semibold text-neutral-900 leading-none">
                          {date.getDate()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{event.title}</p>
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </p>
                      </div>
                      <Link
                        to="/dashboard/events"
                        className="text-sm px-4 py-1.5 rounded-full bg-[#2e0052] text-white hover:bg-[#3d0069] transition shrink-0"
                      >
                        Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ===== Right column ===== */}
        <div className="space-y-6">
          {/* Project Progress */}
          <section className="rounded-xl border border-neutral-200 bg-[#4b0082] p-5">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Project Progress</h2>

            {projectsLoading ? (
              <Skeleton className="h-32 rounded-xl" />
            ) : projects.length === 0 ? (
              <p className="text-sm text-neutral-400 mb-4">No projects yet.</p>
            ) : (
              <div className="space-y-4 mb-4">
                {projects.map((project) => {
                  const total = project.tasks.length;
                  const done = project.tasks.filter((t) => t.status === "completed").length;
                  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                  return (
                    <div key={project._id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-neutral-800 truncate">{project.title}</span>
                        <span className="text-neutral-400">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-100">
                        <div
                          className="h-1.5 rounded-full bg-[#2e0052]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Link
              to="/dashboard/projects"
              className="block text-center text-sm border border-dashed border-neutral-300 rounded-lg py-2 text-neutral-500 hover:border-violet-200 hover:text-[#4b0082] transition"
            >
              + New Project
            </Link>
          </section>

          {/* Community Pulse — no backend endpoint yet, honest empty state */}
          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Community Pulse</h2>
            <EmptyCard
              icon={<Users className="w-5 h-5" />}
              message="Community activity is coming soon."
            />
          </section>
        </div>
      </div>
    </div>
  );
}

const StatChip = ({ label, value, suffix }: { label: string; value: number; suffix: string }) => (
  <div className="rounded-xl bg-white/10 border border-white/15 px-5 py-3 min-w-[9rem]">
    <p className="text-[11px] text-violet-200 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-semibold mt-0.5">
      {value} {suffix && <span className="text-sm font-normal text-violet-200">{suffix}</span>}
    </p>
  </div>
);

const EmptyCard = ({ icon, message }: { icon: React.ReactNode; message: string }) => (
  <div className="rounded-xl border border-dashed border-neutral-200 p-8 flex flex-col items-center justify-center text-center text-neutral-400 gap-2">
    {icon}
    <p className="text-sm">{message}</p>
  </div>
);