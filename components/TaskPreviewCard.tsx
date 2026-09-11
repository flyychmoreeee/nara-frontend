import React from "react";
import { CalendarDays, Info } from "lucide-react";
import { Course } from "@/types";

interface TaskPreviewCardProps {
  selectedCourse?: Course;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  dueInfo: {
    formatted: string;
    relative: string;
    isPast: boolean;
  } | null;
}

export function TaskPreviewCard({
  selectedCourse,
  title,
  description,
  dueDate,
  isCompleted,
  dueInfo,
}: TaskPreviewCardProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      {/* Pinned Sticky Memo (Post-it note style) */}
      <div className="relative pt-3">
        {/* Realistic Tape Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-24 h-6 bg-amber-200/90 border border-amber-300/80 backdrop-blur-xs shadow-xs -rotate-2 transform" />

        <div className="bg-[#fefce8] border-2 border-amber-300/80 rounded-xl p-6 shadow-[5px_7px_15px_rgba(0,0,0,0.07)] rotate-0.5 transition-transform duration-200 hover:rotate-0">
          <div className="flex items-center justify-between border-b-2 border-dashed border-amber-200 pb-3 mb-4">
            <span className="text-xs font-black uppercase text-amber-900/80 font-mono">
            Sticky Note Preview
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}
            >
              {isCompleted ? "Selesai" : "Ditugaskan"}
            </span>
          </div>

          {/* Card Content */}
          <div className="space-y-3.5">
            {/* Course Tag */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                {selectedCourse?.code || "Kode Matkul"}
              </span>
              <span className="text-xs font-semibold text-slate-800 truncate">
                {selectedCourse?.name || "Nama Mata Kuliah"}
              </span>
            </div>

            {/* Task Title */}
            <h3 className="font-bold text-slate-900 text-base leading-snug wrap-break-word">
              {title || (
                <span className="text-amber-800/40 italic font-normal">
                  Judul tugas akan tertulis di sini...
                </span>
              )}
            </h3>

            {/* Description Memo */}
            {description ? (
              <p className="text-xs text-slate-700 bg-white/70 p-3 rounded-lg border border-amber-200/80 whitespace-pre-line leading-relaxed font-sans shadow-2xs">
                {description}
              </p>
            ) : null}

            {/* Due Date Details */}
            <div className="pt-2 border-t-2 border-dashed border-amber-200 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <CalendarDays className="w-3.5 h-3.5 text-amber-800/70" />
                {dueInfo ? (
                  <span
                    className={
                      dueInfo.isPast
                        ? "text-rose-700 font-bold"
                        : "text-slate-800 font-bold"
                    }
                  >
                    {dueInfo.relative}
                  </span>
                ) : (
                  <span className="text-amber-800/50 italic">Tenggat belum diatur</span>
                )}
              </div>

              {dueInfo && dueDate && (
                <span className="text-[11px] font-mono text-slate-600 bg-amber-100/60 px-1.5 py-0.5 rounded">
                  {new Date(dueDate).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card / Whiteboard Marker Note */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-xs text-slate-700 shadow-[3px_3px_0px_0px_rgba(203,213,225,0.9)] flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
        <p className="leading-relaxed">
          Tugas yang disubmit ke papan akan otomatis masuk ke antrean reminder WhatsApp.
        </p>
      </div>

      {/* Quick Whiteboard Tips */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-5 text-xs shadow-[3px_3px_0px_0px_rgba(203,213,225,0.9)] space-y-2">
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          Tips Cepat Papan Tugas
        </h4>
        <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
          <li>
            Gunakan tombol <span className="font-bold text-slate-800">Label</span> di atas judul untuk mengelompokkan kategori tugas.
          </li>
          <li>
            Pilih preset tenggat seperti <span className="font-bold text-slate-800">Besok (23:59)</span> agar pengisian lebih cepat.
          </li>
          <li>
            Tekan tombol <span className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-300 font-bold text-slate-800">Reset</span> jika ingin mengulang formulir dari awal.
          </li>
        </ul>
      </div>
    </div>
  );
}
