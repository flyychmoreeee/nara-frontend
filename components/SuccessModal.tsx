"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { Task } from "@/types";

interface SuccessModalProps {
  task: Task;
  onClose: () => void;
}

export function SuccessModal({ task, onClose }: SuccessModalProps) {
  const [stage, setStage] = useState(0); // 0=enter, 1=rings, 2=details-slide
  const hasFired = useRef(false);

  // Side cannons confetti on mount
  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const end = Date.now() + 3 * 1000;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
        zIndex: 9999,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  // Staged entrance
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <>
      <style>{`
        @keyframes modal-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(30px);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes ring-expand {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes slide-up-fade {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient-slide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease forwards",
        }}
      >
        {/* Modal Card */}
        <div
          className="relative bg-white border-2 border-slate-900 rounded-2xl max-w-sm w-full overflow-hidden"
          style={{
            animation: "modal-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            boxShadow: "8px 8px 0px 0px rgba(15,23,42,1)",
          }}
        >
          {/* Animated gradient strip */}
          <div
            className="h-1.5 w-full"
            style={{
              background: "linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6, #06b6d4, #f59e0b)",
              backgroundSize: "300% 100%",
              animation: "gradient-slide 3s ease infinite",
            }}
          />

          <div className="p-6 pt-5">
            {/* Ring pulse area */}
            <div className="flex items-center justify-center mb-4 relative">
              {stage >= 1 && (
                <div
                  className="absolute w-16 h-16 rounded-full border-2 border-amber-300"
                  style={{ animation: "ring-expand 0.8s ease-out forwards" }}
                />
              )}
              {stage >= 1 && (
                <div
                  className="absolute w-16 h-16 rounded-full border-2 border-violet-300"
                  style={{ animation: "ring-expand 0.8s 0.15s ease-out forwards" }}
                />
              )}
            </div>

            {/* Title */}
            <h3
              className="text-lg font-black text-center text-slate-900"
              style={{
                animation: stage >= 2 ? "slide-up-fade 0.4s ease forwards" : "none",
                opacity: stage >= 2 ? undefined : 0,
              }}
            >
              Tugas Berhasil Ditempel!
            </h3>
            <p
              className="text-xs text-center text-slate-500 mt-1 mb-5"
              style={{
                animation: stage >= 2 ? "slide-up-fade 0.4s 0.1s ease forwards" : "none",
                opacity: stage >= 2 ? undefined : 0,
              }}
            >
              Satu langkah lebih dekat ke nilai A+, semangat!
            </p>

            {/* Summary card */}
            <div
              className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2.5 text-xs mb-5"
              style={{
                animation: stage >= 2 ? "slide-up-fade 0.4s 0.2s ease forwards" : "none",
                opacity: stage >= 2 ? undefined : 0,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium shrink-0">Mata Kuliah</span>
                <span className="font-bold text-slate-900 text-right truncate">
                  {task.course?.name || "—"}
                </span>
              </div>
              <div className="w-full h-px bg-slate-200" />
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium shrink-0">Judul</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-52">
                  {task.title}
                </span>
              </div>
              {task.due_date && (
                <>
                  <div className="w-full h-px bg-slate-200" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium shrink-0">Tenggat</span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-[11px]">
                      {new Date(task.due_date).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={onClose}
              type="button"
              className="w-full py-3 px-4 rounded-xl text-white text-xs font-bold border-2 border-slate-900 cursor-pointer transition-all"
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                boxShadow: "3px 3px 0px 0px #0f172a",
                animation: stage >= 2 ? "slide-up-fade 0.4s 0.3s ease forwards" : "none",
                opacity: stage >= 2 ? undefined : 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(1px, 1px)";
                e.currentTarget.style.boxShadow = "2px 2px 0px 0px #0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "3px 3px 0px 0px #0f172a";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translate(3px, 3px)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translate(1px, 1px)";
                e.currentTarget.style.boxShadow = "2px 2px 0px 0px #0f172a";
              }}
            >
              Tulis Tugas Lain
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
