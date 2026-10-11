import { useRef, useState } from "react";
import { CheckCircle2, Loader2, RotateCcw, Send, Sparkles, XCircle, Zap } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { useAskAi, useGenerateQuiz } from "../hooks/libraryHooks";
import type { QuizResponse } from "../types/libraryTypes";
import { PrimaryButton } from "./LibraryBits";

const errMessage = (e: any) =>
  e?.response?.data?.message || e?.message || "Something went wrong. Please try again.";

const SUGGESTIONS = ["Summarize the key points", "What are the main topics covered?"];

interface QA {
  q: string;
  a?: string;
  error?: string;
}

/* ── Quiz runner ── */
const QuizRunner = ({ quiz, onReset }: { quiz: QuizResponse; onReset: () => void }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;
  const score = quiz.questions.reduce(
    (s, q, i) => (answers[i] === q.answerIndex ? s + 1 : s),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
          {answered === total ? `Score: ${score}/${total}` : `${answered}/${total} answered`}
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> New quiz
        </button>
      </div>

      {quiz.questions.map((q, i) => {
        const picked = answers[i];
        const done = picked !== undefined;
        return (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 space-y-2"
          >
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {i + 1}. {q.question}
            </p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.answerIndex;
                const isPicked = picked === oi;
                return (
                  <button
                    key={oi}
                    disabled={done}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                    className={cn(
                      "w-full text-left text-[13px] rounded-lg px-3 py-2 border transition flex items-start gap-2",
                      !done &&
                        "border-neutral-200 dark:border-neutral-800 hover:border-violet-400 hover:bg-violet-50/60 dark:hover:bg-[#9d4edd]/10 cursor-pointer",
                      done && isCorrect &&
                        "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200",
                      done && isPicked && !isCorrect &&
                        "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200",
                      done && !isCorrect && !isPicked &&
                        "border-neutral-200 dark:border-neutral-800 opacity-60",
                    )}
                  >
                    <span className="font-mono text-xs mt-0.5">{"ABCD"[oi]}.</span>
                    <span className="flex-1">{opt}</span>
                    {done && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                    {done && isPicked && !isCorrect && (
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
            {done && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg px-3 py-2">
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── Panel ── */
export const AiPanel = ({ resourceId }: { resourceId: string }) => {
  const [tab, setTab] = useState<"ask" | "quiz">("ask");
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QA[]>([]);
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [quizError, setQuizError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const ask = useAskAi();
  const gen = useGenerateQuiz();

  const send = (text: string) => {
    const q = text.trim();
    if (q.length < 3 || ask.isPending) return;
    setQuestion("");
    setHistory((h) => [...h, { q }]);
    ask.mutate(
      { id: resourceId, question: q },
      {
        onSuccess: (res) => {
          setHistory((h) => h.map((x, i) => (i === h.length - 1 ? { ...x, a: res.answer } : x)));
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        },
        onError: (e) =>
          setHistory((h) =>
            h.map((x, i) => (i === h.length - 1 ? { ...x, error: errMessage(e) } : x)),
          ),
      },
    );
  };

  const generate = () => {
    setQuizError("");
    gen.mutate(
      { id: resourceId, count },
      { onSuccess: setQuiz, onError: (e) => setQuizError(errMessage(e)) },
    );
  };

  return (
    <aside className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0d0d0d] min-h-[320px]">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <Sparkles className="w-4 h-4 text-[#4b0082] dark:text-[#d9b8ff]" />
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
          LeafLine AI Assistant
        </h3>
      </div>

      <div className="flex gap-1 px-4">
        {(["ask", "quiz"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 h-8 rounded-lg text-xs font-medium transition cursor-pointer",
              tab === t
                ? "bg-[#4b0082] text-white dark:bg-[#9d4edd]"
                : "bg-white dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800",
            )}
          >
            {t === "ask" ? "Ask about this" : "Practice quiz"}
          </button>
        ))}
      </div>

      {tab === "ask" ? (
        <div className="flex flex-col flex-1 min-h-0 p-4 pt-3 gap-3">
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[320px] pr-1">
            {history.length === 0 && (
              <div className="space-y-2">
                <p className="text-[13px] text-neutral-500">
                  Ask anything about this document. Answers come only from its content.
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left text-xs rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] hover:border-violet-400 transition cursor-pointer"
                  >
                    “{s}”
                  </button>
                ))}
              </div>
            )}
            {history.map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="ml-auto max-w-[90%] w-fit rounded-xl rounded-br-sm px-3 py-2 text-[13px] bg-[#4b0082] text-white dark:bg-[#9d4edd]">
                  {m.q}
                </div>
                {m.a && (
                  <div className="max-w-[95%] rounded-xl rounded-bl-sm px-3 py-2 text-[13px] whitespace-pre-wrap bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100">
                    {m.a}
                  </div>
                )}
                {m.error && (
                  <div className="max-w-[95%] rounded-xl px-3 py-2 text-[13px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    {m.error}
                  </div>
                )}
                {!m.a && !m.error && (
                  <div className="inline-flex items-center gap-2 text-xs text-neutral-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Reading the document…
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(question);
                }
              }}
              rows={2}
              maxLength={1000}
              placeholder="e.g. What is the time complexity of…"
              className="flex-1 resize-none rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
            <button
              onClick={() => send(question)}
              disabled={question.trim().length < 3 || ask.isPending}
              aria-label="Send question"
              className="h-10 w-10 rounded-lg flex items-center justify-center bg-[#4b0082] dark:bg-[#9d4edd] text-white disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 pt-3 space-y-3">
          {quiz ? (
            <QuizRunner quiz={quiz} onReset={() => setQuiz(null)} />
          ) : (
            <>
              <p className="text-[13px] text-neutral-500">
                Generate multiple-choice questions from this document to test yourself.
              </p>
              <label className="flex items-center justify-between gap-3 text-sm">
                <span className="text-neutral-700 dark:text-neutral-300">Number of questions</span>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="h-9 rounded-lg px-2 text-sm bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                >
                  {[3, 5, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <PrimaryButton onClick={generate} disabled={gen.isPending} className="w-full">
                {gen.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Start practice session
                  </>
                )}
              </PrimaryButton>
              {quizError && (
                <p className="text-xs rounded-lg px-3 py-2 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {quizError}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </aside>
  );
};
