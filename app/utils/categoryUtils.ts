// app/utils/categoryUtils.ts
import type { Category } from "../types";

/**
 * Fügt eine neue Kategorie zum Array hinzu (Unit-Testbar).
 * Erwartet, dass der aufrufende Code schon alle notwendigen Felder (id, name, count…) setzt.
 */
export function addCategory(
  categories: Category[],
  newCat: Category
): Category[] {
  return [...categories, newCat];
}

/**
 * Entfernt eine Kategorie anhand ihrer ID aus dem Array (Unit-Testbar).
 */
export function deleteCategory(
  categories: Category[],
  id: number
): Category[] {
  return categories.filter((c) => c.categoryID !== id);
}
