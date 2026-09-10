import React, { useState, useMemo } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { Course } from "@/types";

interface CourseSelectProps {
  courses: Course[];
  selectedCourseId: number | "";
  onSelectCourse: (courseId: number) => void;
  isLoading: boolean;
  errorMessage?: string;
}

export function CourseSelect({
  courses,
  selectedCourseId,
  onSelectCourse,
  isLoading,
  errorMessage,
}: CourseSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === Number(selectedCourseId));
  }, [courses, selectedCourseId]);

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const query = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        (c.lecturer && c.lecturer.toLowerCase().includes(query))
    );
  }, [courses, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          Mata Kuliah <span className="text-rose-600">*</span>
        </label>
        {selectedCourse?.semester?.name && (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
            {selectedCourse.semester.name}
          </span>
        )}
      </div>

      {/* Custom Dropdown Trigger */}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all duration-150 ${
            errorMessage
              ? "border-rose-500 bg-rose-50/30"
              : isOpen
              ? "border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              : "border-slate-300 hover:border-slate-400 shadow-xs"
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {selectedCourse ? (
              <>
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                  {selectedCourse.code}
                </span>
                <span className="font-semibold text-slate-900 truncate">
                  {selectedCourse.name}
                </span>
              </>
            ) : (
              <span className="text-slate-400">
                {isLoading ? "Memuat mata kuliah..." : "-- Pilih Mata Kuliah --"}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
              isOpen ? "rotate-180 text-slate-900" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] max-h-64 overflow-hidden flex flex-col animate-fade-in">
              {/* Search Bar */}
              <div className="p-2 border-b-2 border-slate-200 bg-slate-50">
                <input
                  type="text"
                  placeholder="Cari kode atau nama matkul..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                  autoFocus
                />
              </div>

              {/* Course Items List */}
              <div className="overflow-y-auto max-h-48 p-1 divide-y divide-slate-100">
                {isLoading ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Memuat data...
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Tidak ada mata kuliah ditemukan
                  </div>
                ) : (
                  filteredCourses.map((course) => {
                    const isSelected = Number(selectedCourseId) === course.id;
                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          onSelectCourse(course.id);
                          setIsOpen(false);
                        }}
                        className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-slate-100 text-slate-900 font-medium"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
                            {course.code}
                          </span>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {course.name}
                            </p>
                            {course.lecturer && (
                              <p className="text-[11px] text-slate-500 truncate">
                                {course.lecturer}
                              </p>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2 stroke-[2.5]" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
