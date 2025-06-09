// app/types.ts

/**
 * Ein Task-Objekt, wie es in der App verwendet wird.
 */
export type Task = {
  taskID: number;
  name: string;
  checked: boolean;
  important: boolean;
  categoryID: number;
  date: string;
};

/**
 * Eine Kategorie (Category), wie sie in der App verwendet wird.
 */
export type Category = {
  categoryID: number;
  userID: number;
  name: string;
};
