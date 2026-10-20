export type TodoStatus = 'waiting' | 'in progress' | 'done';

export interface Todo {
  id: string;
  name: string;
  content: string;
  status: TodoStatus;
}