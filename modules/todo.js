import { format } from "date-fns";

export const Todo = ({
  id = crypto.randomUUID(),
  title = "",
  description = "",
  dueDate = "",
  priority = "low", // 'low | 'med' | 'high'
  complete = false
} = {}) => ({
  id, title, description, dueDate, priority, complete,
  toggle() { this.complete = !this.complete; },
  toDisplayDate() {
    if (!this.dueDate) return "";
    try { return format(new Date(this.dueDate), "pp"); }
    catch { return this.dueDate; }
  }
});

export const reviveTodo = (plain) => Todo(plain);