export interface Task {
    _id: string;
    title: string;
    deadline: string;
    priority: "low" | "medium" | "high";
    stage: number;
    userId: string;
  }
  export interface TaskForm {
    userId: string;
    title: string;
    description?: string;
    deadline: string;
    priority: "" | "low" | "medium" | "high";
    stage: number;
  }