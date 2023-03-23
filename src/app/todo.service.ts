import { Injectable } from '@angular/core';
import { open } from 'sqlite';
import { Database } from 'sqlite3';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private db!: Database;

  constructor() {
    open({
      filename: 'angularDB.db',
      driver: require('sqlite3').verbose().Database
    }).then(db => {
      this.db = db;
      this.db.run(`
        CREATE TABLE IF NOT EXISTS todo (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          completed BOOLEAN NOT NULL DEFAULT 0
        )
      `);
    });
  }

  async createTodoItem(name: string, description?: string): Promise<void> {
    const id = Math.floor(Math.random() * 1000000);
    await this.db.run(
      'INSERT INTO todo (id, name, description) VALUES (?, ?, ?)',
      [id, name, description]
    );
  }

  async listTodoItems(): Promise<{ id: number, name: string, description?: string, completed: boolean }[]> {
    const rows = await this.db.all('SELECT * FROM todo');
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      completed: !!row.completed
    }));
  }

  async deleteTodoItem(id: number): Promise<void> {
    await this.db.run('DELETE FROM todo WHERE id = ?', [id]);
  }
}