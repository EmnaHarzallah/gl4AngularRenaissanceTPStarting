import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../service/todo.service';
import { TodoStatus } from '../model/todo';
import { Column } from '../model/column';

@Component({
  selector: 'app-todo',
  imports: [FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent {
  private readonly todoService = inject(TodoService);

  protected readonly columns : Column[] = [
    { status: 'waiting', label: 'Waiting', css: 'waiting', todos: this.todoService.waiting },
    { status: 'in progress', label: 'In Progress Todos', css: 'in-progress', todos: this.todoService.inProgress },
    { status: 'done', label: 'Done Todos', css: 'done', todos: this.todoService.done },
  ];

  protected readonly name = signal('');
  protected readonly content = signal('');

  protected add() {
    const name = this.name().trim();
    if (!name) 
      return;
    this.todoService.addTodo(name, this.content().trim());
    this.name.set('');
    this.content.set('');
  }

  protected onStatusChange(id: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value as TodoStatus;
    this.todoService.changeStatus(id, status);
  }

  protected remove(id: string) {
    this.todoService.deleteTodo(id);
  }
}