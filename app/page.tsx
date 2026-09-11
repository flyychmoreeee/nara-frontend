"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Course, Task } from "@/types";
import { fetchCourses, createTask, fetchTasks, toggleTaskComplete, deleteTask, ApiError } from "@/lib/api";
import { AlertBanner } from "@/components/AlertBanner";
import { TaskForm } from "@/components/TaskForm";
import { TaskPreviewCard } from "@/components/TaskPreviewCard";
import { SuccessModal } from "@/components/SuccessModal";
import { ExistingTasksList } from "@/components/ExistingTasksList";

export default function SubmitTaskPage() {
  // Course State
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Form State
  const [courseId, setCourseId] = useState<number | "">("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [createdTask, setCreatedTask] = useState<Task | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Existing Tasks State
  const [existingTasks, setExistingTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [taskCourseFilter] = useState<number | null>(null);

  // Initial load courses on mount
  useEffect(() => {
    let isMounted = true;

    fetchCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setIsLoadingCourses(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load courses:", err);
          if (err instanceof ApiError) {
            setCourseError(err.message);
          } else {
            setCourseError("Gagal memuat daftar mata kuliah. Pastikan backend aktif.");
          }
          setIsLoadingCourses(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Load existing tasks on mount and when course filter changes
  useEffect(() => {
    let isMounted = true;
    const params: { course_id?: number; status?: 'pending' | 'completed' | 'all' } = {};
    if (taskCourseFilter) {
      params.course_id = taskCourseFilter;
    }

    fetchTasks(params)
      .then((data) => {
        if (isMounted) {
          setExistingTasks(data);
          setIsLoadingTasks(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load tasks:", err);
          if (err instanceof ApiError) {
            setTasksError(err.message);
          } else {
            setTasksError("Gagal memuat daftar tugas.");
          }
          setIsLoadingTasks(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [taskCourseFilter]);

  // Manual reload for retry button and post-submission refresh
  const loadExistingTasks = async () => {
    setIsLoadingTasks(true);
    setTasksError(null);
    try {
      const params: { course_id?: number; status?: 'pending' | 'completed' | 'all' } = {};
      if (taskCourseFilter) {
        params.course_id = taskCourseFilter;
      }
      const data = await fetchTasks(params);
      setExistingTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      if (err instanceof ApiError) {
        setTasksError(err.message);
      } else {
        setTasksError("Gagal memuat daftar tugas.");
      }
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Toggle task completion status
  const handleToggleComplete = async (taskId: number) => {
    try {
      const updatedTask = await toggleTaskComplete(taskId);
      setExistingTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
      throw err;
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setExistingTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
      throw err;
    }
  };

  // Manual reload courses action
  const handleReloadCourses = async () => {
    setIsLoadingCourses(true);
    setCourseError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      if (err instanceof ApiError) {
        setCourseError(err.message);
      } else {
        setCourseError("Gagal memuat daftar mata kuliah. Pastikan backend aktif.");
      }
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === Number(courseId));
  }, [courses, courseId]);

  // Clear specific validation error helper
  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setCourseId("");
    setTitle("");
    setDescription("");
    setDueDate("");
    setIsCompleted(false);
    setValidationErrors({});
    setSubmitError(null);
  };

  // Format Due Date for preview
  const dueInfo = useMemo(() => {
    if (!dueDate) return null;
    try {
      const dt = new Date(dueDate);
      if (isNaN(dt.getTime())) return null;

      const formatted = new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dt);

      const now = new Date();
      const diffMs = dt.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let relative = "";
      if (diffMs < 0) {
        relative = "Lewat tenggat";
      } else if (diffDays === 0) {
        relative = "Hari ini";
      } else if (diffDays === 1) {
        relative = "Besok";
      } else {
        relative = `${diffDays} hari lagi`;
      }

      return { formatted, relative, isPast: diffMs < 0 };
    } catch {
      return null;
    }
  }, [dueDate]);

  // Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setSubmitError(null);
    setValidationErrors({});

    if (!courseId) {
      setValidationErrors((prev) => ({
        ...prev,
        course_id: ["Silakan pilih mata kuliah terlebih dahulu."],
      }));
      return;
    }

    if (!title.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        title: ["Judul tugas tidak boleh kosong."],
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      let formattedDate: string | null = null;
      if (dueDate) {
        const d = new Date(dueDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const hours = String(d.getHours()).padStart(2, "0");
          const mins = String(d.getMinutes()).padStart(2, "0");
          const secs = String(d.getSeconds()).padStart(2, "0");
          formattedDate = `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
        }
      }

      const task = await createTask({
        course_id: Number(courseId),
        title: title.trim(),
        description: description.trim() || null,
        due_date: formattedDate,
        is_completed: isCompleted,
      });

      setCreatedTask(task);
      setShowSuccessModal(true);
      resetForm();
      loadExistingTasks();
    } catch (err) {
      console.error("Submission failed:", err);
      if (err instanceof ApiError) {
        setSubmitError(err.message);
        if (err.errors) {
          setValidationErrors(err.errors);
        }
      } else {
        setSubmitError("Terjadi kesalahan saat menyimpan tugas. Silakan periksa koneksi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen whiteboard-dots text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Whiteboard Board Container with Bezel Frame */}
        <div className="bg-white/95 border-4 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.12)] relative">
          {/* Subtle Top Marker/Eraser Shelf Accent */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                Tambah Tugas Kuliah
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Kelola daftar tugas kuliah atau tambahkan tugas baru di bawah.
              </p>
            </div>

            {/* Dry Erase Markers Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-3 h-8 rounded-sm bg-slate-900 shadow-2xs" title="Marker Hitam" />
              <span className="w-3 h-8 rounded-sm bg-blue-600 shadow-2xs" title="Marker Biru" />
              <span className="w-3 h-8 rounded-sm bg-rose-600 shadow-2xs" title="Marker Merah" />
              <span className="w-3 h-8 rounded-sm bg-emerald-600 shadow-2xs" title="Marker Hijau" />
            </div>
          </div>

          {/* Global Error Banner if API Fails */}
          {courseError && (
            <AlertBanner
              title="Gagal mengambil data mata kuliah"
              message={courseError}
              subMessage={`Pastikan backend Laravel Anda berjalan di ${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
                }`}
              onRetry={handleReloadCourses}
            />
          )}

          {/* Form Submission Error Banner */}
          {submitError && (
            <AlertBanner
              title="Gagal Menyimpan Tugas"
              message={submitError}
            />
          )}

          {/* Existing Tasks Section */}
          <div className="mb-8">
            <ExistingTasksList
              tasks={existingTasks}
              isLoading={isLoadingTasks}
              error={tasksError}
              onRetry={loadExistingTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Grid Layout: Form (7 cols) + Sticky Memo Preview (5 cols) */}
          <div className="pt-8 border-t-2 border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <TaskForm
                courses={courses}
                isLoadingCourses={isLoadingCourses}
                courseId={courseId}
                setCourseId={setCourseId}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                dueDate={dueDate}
                setDueDate={setDueDate}
                isCompleted={isCompleted}
                setIsCompleted={setIsCompleted}
                validationErrors={validationErrors}
                clearValidationError={clearValidationError}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onReset={resetForm}
                dueInfo={dueInfo}
              />

              <TaskPreviewCard
                selectedCourse={selectedCourse}
                title={title}
                description={description}
                dueDate={dueDate}
                isCompleted={isCompleted}
                dueInfo={dueInfo}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && createdTask && (
        <SuccessModal
          task={createdTask}
          onClose={() => {
            setShowSuccessModal(false);
            setCreatedTask(null);
          }}
        />
      )}
    </div>
  );
}
