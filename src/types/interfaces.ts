export interface Task {
  id: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function isTask(obj: unknown): obj is Task {
  if (obj === null || typeof obj !== "object") return false;
  const task = obj as Record<string, unknown>;

  return (
    typeof task.id === "number" &&
    typeof task.description === "string" &&
    typeof task.status === "string" &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string"
  );
}

export function isTasks(data: unknown): data is Task[] {
  return Array.isArray(data) && data.every(isTask);
}
