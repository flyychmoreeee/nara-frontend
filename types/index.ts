export interface Semester {
  id: number;
  name?: string;
  semester?: number | string;
  academic_year?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  lecturer?: string | null;
  day_of_week?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  room?: string | null;
  color?: string | null;
  semester_id?: number;
  semester?: Semester | null;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  course?: Course;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskPayload {
  course_id: number | '';
  title: string;
  description: string;
  due_date: string;
  is_completed: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
