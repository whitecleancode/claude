export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

function getKey(taskId: string): string {
  return `task-subtasks-${taskId}`;
}

export function getSubtasks(taskId: string): Subtask[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(getKey(taskId));
  return raw ? JSON.parse(raw) : [];
}

export function setSubtasks(taskId: string, subtasks: Subtask[]): void {
  localStorage.setItem(getKey(taskId), JSON.stringify(subtasks));
}

export function addSubtask(taskId: string, text: string): Subtask[] {
  const subtasks = getSubtasks(taskId);
  subtasks.push({ id: crypto.randomUUID(), text, done: false });
  setSubtasks(taskId, subtasks);
  return subtasks;
}

export function toggleSubtask(taskId: string, subtaskId: string): Subtask[] {
  const subtasks = getSubtasks(taskId);
  const item = subtasks.find((s) => s.id === subtaskId);
  if (item) item.done = !item.done;
  setSubtasks(taskId, subtasks);
  return subtasks;
}

export function removeSubtask(taskId: string, subtaskId: string): Subtask[] {
  const subtasks = getSubtasks(taskId).filter((s) => s.id !== subtaskId);
  setSubtasks(taskId, subtasks);
  return subtasks;
}
