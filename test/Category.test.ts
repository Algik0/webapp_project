import { describe, it, expect } from "@jest/globals";
import type { Category } from "../app/types";
import { addCategory, deleteCategory } from "../app/utils/categoryUtils";

describe("Category-Utils (Unit)", () => {
  it("addCategory fügt eine neue Kategorie korrekt hinzu und ändert das Original-Array nicht", () => {
    const base: Category[] = [
      { categoryID: 1, userID: 42, name: "Abgaben" },
    ];

    const newCat: Category = {
      categoryID: 2,
      userID: 42,
      name: "Hausaufgaben",
    };

    const updated = addCategory(base, newCat);
    expect(updated).toHaveLength(2);
    expect(updated[1]).toEqual(newCat);
    // Original-Array bleibt unverändert
    expect(base).toHaveLength(1);
  });

  it("deleteCategory entfernt eine Kategorie korrekt und lässt das Original-Array unverändert", () => {
    const cats: Category[] = [
      { categoryID: 1, userID: 42, name: "Abgaben" },
      { categoryID: 2, userID: 42, name: "Hausaufgaben" },
    ];

    const result = deleteCategory(cats, 1);
    expect(result).toHaveLength(1);
    expect(result.find((c) => c.categoryID === 1)).toBeUndefined();
    // Original-Array bleibt unverändert
    expect(cats).toHaveLength(2);
  });
});
