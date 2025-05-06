// Task-Typ wie in der DB
export type Task = {
    taskID: number;
    categoryID: number;
    name: string;
    date: string; // Kann auch Date sein, je nachdem wie du speicherst
    checked: boolean;
    important: boolean;
  };
  
  // Kategorie
  export type Category = {
    categoryID: number;
    userID: number;
    name: string;
  };
  
  // User (optional für später)
  export type User = {
    userID: number;
    email: string;
    password: string;
    salt: string;
  };
  