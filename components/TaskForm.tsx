import React, { useState } from "react";
import {
  Tag,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  Clock,
  X,
} from "lucide-react";
import { Course } from "@/types";
import { CourseSelect } from "./CourseSelect";
import { CalendarModal } from "./CalendarModal";

const PREFIX_TAGS = [
  { label: "Tugas", color: "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100" },
  { label: "Kuis", color: "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100" },
  { label: "Proyek", color: "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100" },
  { label: "Laporan", color: "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100" },
  { label: "Praktikum", color: "bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100" },
  { label: "Presentasi", color: "bg-pink-50 text-pink-800 border-pink-300 hover:bg-pink-100" },
  { label: "UTS", color: "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100" },
  { label: "UAS", color: "bg-red-50 text-red-800 border-red-300 hover:bg-red-100" },
];

interface TaskFormProps {
  courses: Course[];
  isLoadingCourses: boolean;
  courseId: number | "";
  setCourseId: (id: number | "") => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  isCompleted: boolean;
  setIsCompleted: (val: boolean) => void;
  validationErrors: Record<string, string[]>;
  clearValidationError: (field: string) => void;
  isSubmitting: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onReset: () => void;
  dueInfo: {
    formatted: string;
    relative: string;
    isPast: boolean;
  } | null;
}

export function TaskForm({
  courses,
  isLoadingCourses,
  courseId,
  setCourseId,
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  isCompleted,
  setIsCompleted,
  validationErrors,
  clearValidationError,
  isSubmitting,
  onSubmit,
  onReset,
  dueInfo,
}: TaskFormProps) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Quick tag click handler
  const handleTagClick = (tagLabel: string) => {
    const prefix = `[${tagLabel}] `;
    if (title.startsWith(prefix)) {
      setTitle(title.replace(prefix, ""));
    } else if (title.startsWith("[")) {
      setTitle(title.replace(/^\[.*?\]\s*/, prefix));
    } else {
      setTitle(prefix + title);
    }
    clearValidationError("title");
  };

  return (
    <div className="lg:col-span-7 bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(203,213,225,0.9)]">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Field 1: Course Selection */}
        <CourseSelect
          courses={courses}
          selectedCourseId={courseId}
          onSelectCourse={(id) => {
            setCourseId(id);
            clearValidationError("course_id");
          }}
          isLoading={isLoadingCourses}
          errorMessage={validationErrors.course_id?.[0]}
        />

        {/* Field 2: Title with Quick Prefix Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              Judul Tugas <span className="text-rose-600">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {title.length}/255
            </span>
          </div>

          {/* Quick Prefix Magnetic Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Label:
            </span>
            {PREFIX_TAGS.map(({ label, color }) => {
              const isTagged = title.includes(`[${label}]`);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleTagClick(label)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold border transition-all cursor-pointer ${
                    isTagged
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs scale-105"
                      : `${color} shadow-xs hover:scale-105`
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            maxLength={255}
            placeholder="Contoh: Tugas 1 - Analisis Algoritma Sorting..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearValidationError("title");
            }}
            className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-150 ${
              validationErrors.title
                ? "border-rose-500 bg-rose-50/30"
                : "border-slate-300 focus:border-slate-900 shadow-xs focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            }`}
          />

          {validationErrors.title && (
            <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {validationErrors.title[0]}
            </p>
          )}
        </div>

        {/* Field 3: Due Date Trigger & Modal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-700" />
              Tenggat Waktu (Due Date)
            </label>
            {dueInfo && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  dueInfo.isPast
                    ? "bg-rose-50 text-rose-700 border-rose-300"
                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                }`}
              >
                <Clock className="w-3 h-3" />
                {dueInfo.relative}
              </span>
            )}
          </div>

          {/* Trigger Card for Opening Modal */}
          <div
            onClick={() => setIsCalendarModalOpen(true)}
            className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all duration-150 ${
              validationErrors.due_date
                ? "border-rose-500 bg-rose-50/30"
                : "border-slate-300 hover:border-slate-900 shadow-xs hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <CalendarDays className="w-4 h-4 text-slate-600 shrink-0" />
              {dueInfo ? (
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-slate-900">
                    {dueInfo.formatted}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400">
                  Pilih tanggal & jam tenggat waktu...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {dueDate ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDueDate("");
                    clearValidationError("due_date");
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                  title="Hapus Tenggat"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              <span className="text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-300">
                Pilih Tanggal
              </span>
            </div>
          </div>

          {/* Calendar Modal Component */}
          <CalendarModal
            isOpen={isCalendarModalOpen}
            onClose={() => setIsCalendarModalOpen(false)}
            value={dueDate}
            onChange={(val) => {
              setDueDate(val);
              clearValidationError("due_date");
            }}
            onClear={() => {
              setDueDate("");
              clearValidationError("due_date");
            }}
          />

          {validationErrors.due_date && (
            <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {validationErrors.due_date[0]}
            </p>
          )}
        </div>

        {/* Field 4: Description / Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Deskripsi & Catatan
          </label>

          <textarea
            rows={4}
            placeholder="Tuliskan instruksi tugas, halaman buku, format pengumpulan, atau catatan tambahan..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shadow-xs transition-all duration-150 resize-y"
          />
        </div>

        {/* Field 5: Status Completion Toggle */}
        <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isCompleted
                  ? "bg-emerald-500 text-white border-emerald-600"
                  : "bg-white text-slate-400 border-slate-300"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Status Penyelesaian
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {isCompleted
                  ? "Tugas ditandai sudah selesai dikerjakan"
                  : "Tugas berstatus pending / belum selesai"}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        {/* Submit Buttons & Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan Tugas...</span>
              </>
            ) : (
              <>
                <span>Simpan Tugas ke Papan</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-2 border-slate-300 shadow-[3px_3px_0px_0px_#cbd5e1] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_#cbd5e1] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none text-xs font-bold transition-all cursor-pointer"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
