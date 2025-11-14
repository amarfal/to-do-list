import { Todo, reviveTodo } from "./todo.js";

export const Project = ({ id = crypto.randomUUID(), name = "Untitled", todos = [] } = {}) => ({
  id, name, todos,
  add(todo) { this.todos.push(todo); },
  remove(todoId) { this.todos = this.todos.filter(t => t.id !== todoId); }
});

export const reviveProject = (plain) => {
  const p = Project({ id: plain.id, name: plain.name, todos: [] });
  (plain.todos || []).forEach(t => p.add(reviveTodo(t)));
  return p;
};