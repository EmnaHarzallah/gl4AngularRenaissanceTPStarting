import { Signal } from '@angular/core';
import { Todo, TodoStatus } from './todo';

export interface Column {
  status: TodoStatus;
  label: string;
  css: string;
  todos: Signal<Todo[]>;
}