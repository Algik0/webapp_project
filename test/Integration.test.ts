// tests/Integration.test.ts
import { describe, it, expect } from "@jest/globals";
import type { Task, Category } from "../app/types";
import {
  addTask,
  deleteTask,
  toggleChecked,
  toggleImportant,
  filterTasksByCategory,
} from "../app/utils/taskUtils";
import { addCategory, deleteCategory } from "../app/utils/categoryUtils";

describe("Integration: Aufgaben und Kategorien", () => {
  it("erstellt Kategorien, fügt Aufgaben hinzu, filtert, togglet und löscht korrekt", () => {
    // 1. Leere Arrays für Kategorien und Tasks
    let categories: Category[] = [];
    let tasks: Task[] = [];

    // 2. Zwei Beispielkategorien anlegen (Kategorie A und B)
    categories = addCategory(categories, {
      categoryID: 1,
      userID: 42,
      name: "A",
    });
    categories = addCategory(categories, {
      categoryID: 2,
      userID: 42,
      name: "B",
    });
    expect(categories).toHaveLength(2);
    expect(categories.map((c) => c.categoryID)).toEqual([1, 2]);

    // 3. Aufgabe in Kategorie A anlegen
    tasks = addTask(tasks, {
      taskID: 1,
      categoryID: 1,
      name: "Erste Aufgabe",
      date: "2025-05-06",
      checked: false,
      important: false,
    });
    // Aufgabe in Kategorie B anlegen
    tasks = addTask(tasks, {
      taskID: 2,
      categoryID: 2,
      name: "Zweite Aufgabe",
      date: "2025-05-07",
      checked: false,
      important: false,
    });
    expect(tasks).toHaveLength(2);

    // 4. Filtere nach Kategorie A → nur Aufgabe mit taskID=1
    let filtered = filterTasksByCategory(tasks, 1);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].taskID).toBe(1);

    // 5. Erste Aufgabe abhaken (toggleChecked) → checked: false → true
    tasks = toggleChecked(tasks, 1);
    const first = tasks.find((t) => t.taskID === 1);
    expect(first).not.toBeUndefined();
    expect(first!.checked).toBe(true);

    // 6. Erste Aufgabe markieren (toggleImportant) → important: false → true
    tasks = toggleImportant(tasks, 1);
    const firstAfterMark = tasks.find((t) => t.taskID === 1);
    expect(firstAfterMark).not.toBeUndefined();
    expect(firstAfterMark!.important).toBe(true);

    // 7. Erste Aufgabe löschen
    tasks = deleteTask(tasks, 1);
    expect(tasks.find((t) => t.taskID === 1)).toBeUndefined();
    // Filter nach Kategorie A erneut → sollte leer sein
    filtered = filterTasksByCategory(tasks, 1);
    expect(filtered).toHaveLength(0);
    // Gesamt-Anzahl Tasks ist jetzt 1 (nur taskID=2)
    expect(tasks).toHaveLength(1);

    // 8. Kategorie A löschen
    categories = deleteCategory(categories, 1);
    expect(categories.find((c) => c.categoryID === 1)).toBeUndefined();
    // Nur noch Kategorie B übrig
    expect(categories).toHaveLength(1);
    expect(categories[0].categoryID).toBe(2);
  });
});
