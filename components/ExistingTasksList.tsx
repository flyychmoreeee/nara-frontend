import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Check,
  Clock,
  CalendarDays,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Trash2,
  CircleCheck,
  Undo2,
} from "lucide-react";
import { Task } from "@/types";
import { toast } from "@/components/ui/toast";

interface ExistingTasksListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleComplete: (taskId: number) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export function ExistingTasksList({
  tasks,
  isLoading,
  error,
  onRetry,
  onToggleComplete,
  onDelete,
}: ExistingTasksListProps) {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "all">("pending");
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter tasks by search term and tab
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by tab
    if (activeTab === "pending") {
      result = result.filter((t) => !t.is_completed);
    } else if (activeTab === "completed") {
      result = result.filter((t) => t.is_completed);
    }

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.course?.name?.toLowerCase().includes(query) ||
          t.course?.code?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, search, activeTab]);

  const pendingCount = useMemo(() => tasks.filter((t) => !t.is_completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.is_completed).length, [tasks]);

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return null;

      const formatted = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dt);

      const now = new Date();
      const diffMs = dt.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let relative = "";
      let isPast = false;
      if (diffMs < 0) {
        relative = "Lewat tenggat";
        isPast = true;
      } else if (diffDays === 0) {
        relative = "Hari ini";
      } else if (diffDays === 1) {
        relative = "Besok";
      } else {
        relative = `${diffDays} hari lagi`;
      }

      return { formatted, relative, isPast };
    } catch {
      return null;
    }
  };

  const handleToggle = async (task: Task) => {
    setLoadingTaskId(task.id);
    try {
      await onToggleComplete(task.id);
      if (!task.is_completed) {
        toast.add({
          type: "success",
          title: "Tugas Selesai!",
          description: `"${task.title}" berhasil ditandai selesai.`,
        });
      } else {
        toast.add({
          type: "info",
          title: "Status Diperbarui",
          description: `"${task.title}" dikembalikan ke daftar tugas aktif.`,
        });
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
      toast.add({
        type: "error",
        title: "Gagal Mengubah Status",
        description: "Terjadi kesalahan saat memperbarui status tugas.",
        priority: "high",
      });
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDelete = async (task: Task) => {
    setDeletingTaskId(task.id);
    try {
      await onDelete(task.id);
      toast.add({
        type: "success",
        title: "Tugas Dihapus",
        description: `"${task.title}" berhasil dihapus dari daftar.`,
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.add({
        type: "error",
        title: "Gagal Menghapus Tugas",
        description: "Terjadi kesalahan saat menghapus tugas.",
        priority: "high",
      });
    } finally {
      setDeletingTaskId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-[4px_4px_0px_0px_rgba(203,213,225,0.9)] overflow-hidden">
      {/* Header */}
      <div
        className="px-4 sm:px-5 py-4 border-b-2 border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 active:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Tugas yang Sudah Ada
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                {pendingCount} ditugaskan
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                {completedCount} selesai
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="animate-fade-in">
          {/* Search + Tabs */}
          <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari tugas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>

              {/* Filter Dropdown — custom, matching CourseSelect style */}
              <div className="relative shrink-0">
                <div
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`bg-white border-2 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center gap-2 cursor-pointer transition-all duration-150 ${isFilterOpen
                      ? "border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                      : "border-slate-300 hover:border-slate-400 shadow-xs"
                    }`}
                >
                  <span className="text-slate-800 whitespace-nowrap">
                    {activeTab === "pending"
                      ? `Ditugaskan (${pendingCount})`
                      : activeTab === "completed"
                        ? `Selesai (${completedCount})`
                        : `Semua (${tasks.length})`}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${isFilterOpen ? "rotate-180 text-slate-900" : ""}`}
                  />
                </div>

                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute top-full right-0 mt-1.5 z-30 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden animate-fade-in w-48">
                      {[
                        { key: "pending" as const, label: "Ditugaskan", count: pendingCount, icon: Clock },
                        { key: "completed" as const, label: "Selesai", count: completedCount, icon: CheckCircle2 },
                        { key: "all" as const, label: "Semua", count: tasks.length, icon: ClipboardList },
                      ].map(({ key, label, count, icon: Icon }) => {
                        const isSelected = activeTab === key;
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              setActiveTab(key);
                              setIsFilterOpen(false);
                            }}
                            className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${isSelected
                                ? "bg-slate-100 text-slate-900"
                                : "hover:bg-slate-50 text-slate-700"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-slate-900" : "text-slate-400"}`} />
                              <span className="text-xs font-semibold">{label}</span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                {count}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Task List Content */}
          <div className="max-h-100 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Memuat daftar tugas...</span>
              </div>
            ) : error ? (
              <div className="px-5 py-8 text-center">
                <AlertCircle className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-3">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">
                  {search
                    ? "Tidak ada tugas yang cocok dengan pencarian"
                    : activeTab === "pending"
                      ? "Belum ada tugas yang harus dikerjakan"
                      : activeTab === "completed"
                        ? "Belum ada tugas yang sudah selesai"
                        : "Belum ada tugas"}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {search
                    ? "Coba kata kunci lain atau tambah tugas baru"
                    : "Tugas baru akan muncul di sini"}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1.5">
                {filteredTasks.map((task) => {
                  const due = formatDueDate(task.due_date);
                  const isToggling = loadingTaskId === task.id;
                  const isDeleting = deletingTaskId === task.id;
                  const isConfirmingDelete = confirmDeleteId === task.id;
                  const isBusy = isToggling || isDeleting;

                  return (
                    <div
                      key={task.id}
                      className={`px-3 sm:px-4 py-3 rounded-xl border transition-all duration-150 ${task.is_completed
                          ? "bg-emerald-50/40 border-emerald-200/80"
                          : due?.isPast
                            ? "bg-rose-50/30 border-rose-200/80"
                            : "bg-white border-slate-200"
                        } ${isDeleting ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        {/* Status Indicator */}
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${task.is_completed
                              ? "bg-emerald-500 text-white border-emerald-600"
                              : "bg-white text-slate-300 border-slate-300"
                            }`}
                        >
                          {task.is_completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold leading-snug ${task.is_completed
                                ? "text-slate-500 line-through"
                                : "text-slate-900"
                              }`}
                          >
                            {task.title}
                          </p>

                          {/* Course Tag */}
                          {task.course && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {task.course.code}
                              </span>
                              <span className="text-[11px] text-slate-500 truncate">
                                {task.course.name}
                              </span>
                            </div>
                          )}

                          {/* Due Date Row */}
                          {due && (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${task.is_completed
                                    ? "bg-slate-100 text-slate-500 border-slate-200"
                                    : due.isPast
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-amber-50 text-amber-800 border-amber-200"
                                  }`}
                              >
                                {due.relative}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {due.formatted}
                              </span>
                            </div>
                          )}

                          {/* Action Buttons — always visible for mobile */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-dashed border-slate-200/80">
                            {/* Toggle Complete */}
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggle(task)}
                              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${task.is_completed
                                  ? "bg-amber-50 text-amber-800 border-amber-200 active:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200 active:bg-emerald-100"
                                }`}
                            >
                              {isToggling ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : task.is_completed ? (
                                <Undo2 className="w-3.5 h-3.5" />
                              ) : (
                                <CircleCheck className="w-3.5 h-3.5" />
                              )}
                              {isToggling
                                ? "..."
                                : task.is_completed
                                  ? "Belum Selesai"
                                  : "Selesai"}
                            </button>

                            {/* Delete */}
                            {isConfirmingDelete ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => handleDelete(task)}
                                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border bg-rose-600 text-white border-rose-700 active:bg-rose-700 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isDeleting ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                  {isDeleting ? "..." : "Ya, Hapus"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg border bg-white text-slate-600 border-slate-200 active:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                                >
                                  Batal
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => setConfirmDeleteId(task.id)}
                                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border bg-white text-rose-600 border-rose-200 active:bg-rose-50 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isLoading && !error && tasks.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 text-center font-medium">
                {filteredTasks.length === tasks.length
                  ? `Menampilkan semua ${tasks.length} tugas`
                  : `Menampilkan ${filteredTasks.length} dari ${tasks.length} tugas`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
