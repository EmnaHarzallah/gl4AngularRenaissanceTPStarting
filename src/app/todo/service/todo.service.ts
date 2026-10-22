import { computed, inject, Injectable, signal } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { UUID } from '../../uuid-token';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly uuid = inject(UUID);

  private readonly todos = signal<Todo[]>([]);

  readonly waiting = this.byStatus('waiting');
  readonly inProgress = this.byStatus('in progress');
  readonly done = this.byStatus('done');

  private byStatus(status: TodoStatus) {
    return computed(() => this.todos().filter((t) => t.status === status));
  }

  addTodo(name: string, content: string): void {
    const todo: Todo = { id: this.uuid(), name, content, status: 'waiting' };
    this.todos.update((list) => [...list, todo]);
  }

  changeStatus(id: string, status: TodoStatus): void {
    this.todos.update((list) =>
      list.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }

  deleteTodo(id: string): void {
    this.todos.update((list) => list.filter((t) => t.id !== id));
  }

}