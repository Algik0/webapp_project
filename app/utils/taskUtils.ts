// app/utils/taskUtils.ts
import type { Task } from "@/app/types";

/**
 * Fügt eine neue Aufgabe zum Array hinzu.
 * @param tasks Aktuelles Array von Tasks
 * @param newTask Neue Task, die eingefügt werden soll
 * @returns Ein neues Array, das alle alten Tasks plus newTask enthält
 */
export function addTask(tasks: Task[], newTask: Task): Task[] {
  return [...tasks, newTask];
}

/**
 * Entfernt eine Aufgabe anhand ihrer taskID.
 * @param tasks Aktuelles Array von Tasks
 * @param id taskID der zu löschenden Aufgabe
 * @returns Ein neues Array ohne die gelöschte Aufgabe
 */
export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((t) => t.taskID !== id);
}

/**
 * Schaltet das "checked"-Flag (Erledigt) einer Aufgabe um.
 * @param tasks Aktuelles Array von Tasks
 * @param id taskID der umgeschalteten Aufgabe
 * @returns Ein neues Array, in dem das checked-Flag der betreffenden Aufgabe invertiert wurde
 */
export function toggleChecked(tasks: Task[], id: number): Task[] {
  return tasks.map((t) =>
    t.taskID === id ? { ...t, checked: !t.checked } : t
  );
}

/**
 * Schaltet das "important"-Flag einer Aufgabe um.
 * @param tasks Aktuelles Array von Tasks
 * @param id taskID der umgeschalteten Aufgabe
 * @returns Ein neues Array, in dem das important-Flag der betreffenden Aufgabe invertiert wurde
 */
export function toggleImportant(tasks: Task[], id: number): Task[] {
  return tasks.map((t) =>
    t.taskID === id ? { ...t, important: !t.important } : t
  );
}

/**
 * Filtert Tasks nach einer bestimmten categoryID.
 * @param tasks Aktuelles Array von Tasks
 * @param categoryID categoryID, nach der gefiltert werden soll
 * @returns Ein neues Array mit allen Tasks, deren categoryID dem übergebenen Wert entspricht
 */
export function filterTasksByCategory(
  tasks: Task[],
  categoryID: number
): Task[] {
  return tasks.filter((t) => t.categoryID === categoryID);
}
