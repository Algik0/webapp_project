// Task.test.ts
import { describe, it, expect } from "@jest/globals";
import type { Task } from "../app/types";
import {
  addTask,
  deleteTask,
  toggleChecked,
  toggleImportant,
} from "../app/utils/taskUtils";

describe("Task-Utils", () => {
  const baseTask: Task = {
    taskID: 1,
    categoryID: 1,
    name: "Testaufgabe",
    date: "2025-05-06",
    checked: false,
    important: false,
  };

  it("addTask fügt eine neue Aufgabe hinzu und mutiert das Ursprungs-Array nicht", () => {
    const tasks: Task[] = [];
    const newTask: Task = {
      taskID: 2,
      categoryID: 1,
      name: "Neue Aufgabe",
      date: "2025-05-07",
      checked: false,
      important: false,
    };

    const updated = addTask(tasks, newTask);
    expect(updated).toHaveLength(1);
    expect(updated[0]).toEqual(newTask);
    // Original-Array bleibt unverändert
    expect(tasks).toHaveLength(0);
  });

  it("toggleChecked schaltet checked von false → true und true → false um", () => {
    const tasks: Task[] = [baseTask];
    const afterCheck = toggleChecked(tasks, baseTask.taskID);
    expect(afterCheck[0].checked).toBe(true);
    // Original bleibt unverändert
    expect(tasks[0].checked).toBe(false);

    const afterUncheck = toggleChecked(afterCheck, baseTask.taskID);
    expect(afterUncheck[0].checked).toBe(false);
  });

  it("toggleImportant schaltet important von false → true und true → false um", () => {
    const tasks: Task[] = [baseTask];
    const afterMark = toggleImportant(tasks, baseTask.taskID);
    expect(afterMark[0].important).toBe(true);
    expect(tasks[0].important).toBe(false);

    const afterUnmark = toggleImportant(afterMark, baseTask.taskID);
    expect(afterUnmark[0].important).toBe(false);
  });

  it("deleteTask entfernt einen Eintrag und lässt das Original unberührt", () => {
    const tasks: Task[] = [
      baseTask,
      { ...baseTask, taskID: 2, name: "Aufgabe B" },
    ];

    const result = deleteTask(tasks, baseTask.taskID);
    expect(result).toHaveLength(1);
    expect(result.find(t => t.taskID === baseTask.taskID)).toBeUndefined();
    // Original-Array bleibt unverändert
    expect(tasks).toHaveLength(2);
  });
});
