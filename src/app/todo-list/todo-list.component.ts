import { Component } from '@angular/core';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo',
  template: `
    <h2>My Todo List</h2>
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo.name }} - {{ todo.description }} - {{ todo.completed }}
        <button (click)="delete(todo.id)">Delete</button>
      </li>
    </ul>
    <form>
      <label>
        Name:
        <input type="text" [(ngModel)]="name" name="name" required>
      </label>
      <label>
        Description:
        <input type="text" [(ngModel)]="description" name="description">
      </label>
      <button (click)="add()">Add</button>
    </form>
  `,
})
export class TodoComponent {
  name: string='';
  description: string='';
  todos: { id: number, name: string, description?: string, completed: boolean }[] = [];

  constructor(private todoService: TodoService) {
    this.todoService.listTodoItems().then(todos => this.todos = todos);
  }

  async add(): Promise<void> {
    await this.todoService.createTodoItem(this.name, this.description);
    this.name = '';
    this.description = '';
    this.todos = await this.todoService.listTodoItems();
  }

  async delete(id: number): Promise<void> {
    await this.todoService.deleteTodoItem(id);
    this.todos = await this.todoService.listTodoItems();
  }
}