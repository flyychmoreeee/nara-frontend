import { ApiResponse, Course, Task, FetchTasksParams } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nara.trivox.id/api";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${BASE_URL}/courses`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Failed to fetch courses (${res.status})`,
        res.status,
        errorData.errors
      );
    }

    const json: ApiResponse<Course[]> = await res.json();
    return json.data || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Tidak dapat terhubung ke server backend",
      500
    );
  }
}

export async function createTask(payload: {
  course_id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  is_completed?: boolean;
}): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      json.message || `Gagal membuat tugas (${res.status})`,
      res.status,
      json.errors
    );
  }

  return json.data;
}

export async function fetchTasks(params?: FetchTasksParams): Promise<Task[]> {
  try {
    const url = new URL(`${BASE_URL}/tasks`);
    if (params?.course_id) {
      url.searchParams.set("course_id", String(params.course_id));
    }
    if (params?.status) {
      url.searchParams.set("status", params.status);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Failed to fetch tasks (${res.status})`,
        res.status,
        errorData.errors
      );
    }

    const json: ApiResponse<Task[]> = await res.json();
    return json.data || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Tidak dapat mengambil data tugas",
      500
    );
  }
}

export async function toggleTaskComplete(taskId: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/toggle-complete`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      json.message || `Gagal mengubah status tugas (${res.status})`,
      res.status,
      json.errors
    );
  }

  return json.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      json.message || `Gagal menghapus tugas (${res.status})`,
      res.status,
      json.errors
    );
  }
}
