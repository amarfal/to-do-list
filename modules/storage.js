import { reviveProject } from "./project.js";
import { Project } from "./project.js";
import { Todo } from "./todo.js";

const KEY = "todo.projects.v1";

export const Storage = (() => {
  const save = (projects, currentId) => {
    localStorage.setItem(KEY, JSON.stringify({ projects, currentId }));
  };

  const load = () => {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const p = Project({ name: "My First Project" });
      return { projects: [p], currentId: p.id };
    }
    const parsed = JSON.parse(raw);
    return {
      projects: parsed.projects.map(reviveProject),
      currentId: parsed.currentId
    };
  };

  return { save, load, KEY };
})();