"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, X, Calendar as CalendarIcon, Check } from "lucide-react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string; // 'YYYY-MM-DDTHH:mm'
  onChange: (val: string) => void;
  onClear: () => void;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const WEEKDAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const PRESETS = [
  { label: "Hari ini", days: 0 },
  { label: "Besok", days: 1 },
  { label: "3 hari lagi", days: 3 },
  { label: "1 minggu lagi", days: 7 },
  { label: "2 minggu lagi", days: 14 },
];

export function CalendarModal({
  isOpen,
  onClose,
  value,
  onChange,
  onClear,
}: CalendarModalProps) {
  // Parse selected date directly from value
  const selectedDate = useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  // View date state for navigating between months
  const [navMonth, setNavMonth] = useState<Date | null>(null);

  // Derive the active displayed month without useEffect
  const currentMonth = useMemo(() => {
    if (navMonth) return navMonth;
    if (selectedDate) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [navMonth, selectedDate]);

  // Derive current time string from selectedDate or default 23:59
  const time = useMemo(() => {
    if (selectedDate) {
      const h = String(selectedDate.getHours()).padStart(2, "0");
      const m = String(selectedDate.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }
    return "23:59";
  }, [selectedDate]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    setNavMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setNavMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDateTimeLocal = (dateObj: Date, timeStr: string) => {
    const [hoursStr, minsStr] = timeStr.split(":");
    const hours = parseInt(hoursStr || "23", 10);
    const mins = parseInt(minsStr || "59", 10);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const h = String(hours).padStart(2, "0");
    const m = String(mins).padStart(2, "0");

    return `${year}-${month}-${day}T${h}:${m}`;
  };

  const handleSelectDate = (dateObj: Date) => {
    setNavMonth(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
    const formatted = formatDateTimeLocal(dateObj, time);
    onChange(formatted);
  };

  const handleApplyPreset = (daysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    setNavMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    const formatted = formatDateTimeLocal(target, time);
    onChange(formatted);
  };

  const handleTimeChange = (newTime: string) => {
    const baseDate = selectedDate || new Date();
    const formatted = formatDateTimeLocal(baseDate, newTime);
    onChange(formatted);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<{
    date: Date;
    isCurrentMonth: boolean;
    dayNumber: number;
  }> = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    days.push({
      date: new Date(year, month - 1, dayNum),
      isCurrentMonth: false,
      dayNumber: dayNum,
    });
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
      dayNumber: i,
    });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      dayNumber: i,
    });
  }

  const today = new Date();
  const isSameDay = (d1?: Date, d2?: Date) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop Click to Close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box in Whiteboard Style */}
      <div className="relative z-10 bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-w-85 w-full select-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-200">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Tenggat Waktu
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Nav: Month Year */}
        <div className="flex items-center justify-between pb-2 px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-300"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 stroke-2" />
          </button>

          <h4 className="text-sm font-extrabold text-slate-900 tracking-wide">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-300"
            title="Bulan Selanjutnya"
          >
            <ChevronRight className="w-4 h-4 stroke-2" />
          </button>
        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 text-center mb-1">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="text-xs font-bold text-slate-400 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center mb-3">
          {days.map(({ date, isCurrentMonth, dayNumber }, idx) => {
            const selected = isSameDay(date, selectedDate);
            const isCurrentToday = isSameDay(date, today);

            return (
              <div key={idx} className="flex items-center justify-center p-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className={`w-9 h-9 text-xs flex items-center justify-center transition-all cursor-pointer font-medium ${
                    selected
                      ? "bg-slate-900 text-white font-black rounded-xl shadow-sm scale-105"
                      : isCurrentToday
                      ? "bg-slate-100 text-slate-900 font-bold rounded-xl border border-slate-300 hover:bg-slate-200"
                      : isCurrentMonth
                      ? "text-slate-800 hover:bg-slate-100 rounded-xl"
                      : "text-slate-300 hover:text-slate-500 rounded-xl"
                  }`}
                >
                  {dayNumber}
                </button>
              </div>
            );
          })}
        </div>

        {/* Time and Clear Option */}
        <div className="flex items-center justify-between pt-2.5 pb-2.5 px-1 border-t-2 border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>Jam:</span>
            <input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="bg-slate-50 text-slate-900 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono font-bold focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
            />
          </div>

          {selectedDate && (
            <button
              type="button"
              onClick={() => {
                onClear();
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition"
            >
              <X className="w-3 h-3" /> Hapus
            </button>
          )}
        </div>

        {/* Presets Footer */}
        <div className="pt-2.5 border-t border-slate-200 space-y-1.5 mb-4">
          <div className="grid grid-cols-3 gap-1.5">
            {PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.days)}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition text-center cursor-pointer shadow-2xs truncate"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.slice(3).map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.days)}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition text-center cursor-pointer shadow-2xs truncate"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Close / Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-px hover:translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 stroke-3" />
          <span>Selesai</span>
        </button>
      </div>
    </div>
  );
}
