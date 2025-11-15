import { Project } from "./project.js";
import { Todo } from "./todo.js";
import { Storage } from "./storage.js";

export const UI = (() => {
  // state
  let projects = [];
  let currentProjectId = null;

  // DOM
  const els = {
    projectList: document.getElementById("projectList"),
    addProjectBtn: document.getElementById("addProjectBtn"),
    boardTitle: document.getElementById("boardTitle"),
    addTaskBtn: document.getElementById("addTaskBtn"),
    emptyHint: document.getElementById("emptyHint"),
    taskList: document.getElementById("taskList"),
  };

  // helpers
  const currentProject = () => projects.find(p => p.id === currentProjectId);

  const persist = () => Storage.save(projects, currentProjectId);

  const renderProjects = () => {
    els.projectList.innerHTML = "";
    projects.forEach(p => {
      const li = document.createElement("li");
      li.className = "project-item" + (p.id === currentProjectId ? " active" : "");
      li.dataset.id = p.id;

      const name = document.createElement("span");
      name.className = "project-name";
      name.textContent = p.name;

      const del = document.createElement("button");
      del.className = "icon-btn";
      del.title = "Delete project";
      del.textContent = "🗑";

      del.addEventListener("click", (e) => {
        e.stopPropagation();
        if (projects.length === 1) { alert("Keep at least one project."); return; }
        projects = projects.filter(x => x.id !== p.id);
        if (currentProjectId === p.id) currentProjectId = projects[0].id;
        persist();
        renderAll();
      });

      li.addEventListener("click", () => {
        currentProjectId = p.id;
        renderAll();
      });

      li.append(name, del);
      els.projectList.append(li);
    });
  };

  const renderTasks = () => {
    const proj = currentProject();
    els.boardTitle.textContent = proj ? proj.name : "Workboard";
    els.taskList.innerHTML = "";

    if (!proj || proj.todos.length === 0) {
      els.emptyHint.style.display = "block";
    } else {
      els.emptyHint.style.display = "none";
    }

    proj?.todos.forEach(t => {
      const li = document.createElement("li");
      li.className = "task";
      li.dataset.id = t.id;

      const prio = document.createElement("span");
      prio.className = `prio prio-${t.priority}`;

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = t.title + (t.complete ? " ✓" : "");

      const due = document.createElement("span");
      due.className = "due";
      due.textContent = t.toDisplayDate();

      const controls = document.createElement("div");
      controls.className = "controls";

      const btnToggle = document.createElement("button");
      btnToggle.className = "icon-btn";
      btnToggle.title = "Toggle done";
      btnToggle.textContent = "✔";
      btnToggle.addEventListener("click", () => { t.toggle(); persist(); renderTasks(); });

      const btnEdit = document.createElement("button");
      btnEdit.className = "icon-btn";
      btnEdit.title = "Edit";
      btnEdit.textContent = "✎";
      btnEdit.addEventListener("click", () => editTodo(t));

      const btnDel = document.createElement("button");
      btnDel.className = "icon-btn";
      btnDel.title = "Delete";
      btnDel.textContent = "🗑";
      btnDel.addEventListener("click", () => {
        proj.remove(t.id); persist(); renderTasks();
      });

      controls.append(btnToggle, btnEdit, btnDel);

      const expander = document.createElement("div");
      expander.className = "expander";
      expander.textContent = t.description || "(no description)";

      li.append(prio, title, due, controls, expander);
      li.addEventListener("click", (e)=> {
        if (e.target.closest(".icon-btn")) return;
        li.classList.toggle("expanded");
      });

      els.taskList.append(li);
    });
  };

  const newTodoPrompt = () => {
    const title = prompt("Task title:");
    if (!title) return null;
    const description = prompt("Description (optional):") || "";
    const dueDate = prompt("Due date (YYYY-MM-DD) (optional):") || "";
    const priority = (prompt("Priority: low | med | high", "low") || "low").toLowerCase();
    return Todo({ title, description, dueDate, priority });
  };

  const editTodo = (t) => {
    const title = prompt("Edit title", t.title) ?? t.title;
    const description = prompt("Edit description", t.description) ?? t.description;
    const dueDate = prompt("Edit due date (YYYY-MM-DD)", t.dueDate) ?? t.dueDate;
    const priority = (prompt("Priority: low | med | high", t.priority) ?? t.priority).toLowerCase();
    Object.assign(t, { title, description, dueDate, priority });
    persist(); renderTasks();
  };

  const bindEvents = () => {
    els.addProjectBtn.addEventListener("click", () => {
      const name = prompt("Project name:");
      if (!name) return;
      const p = Project({ name });
      projects.push(p);
      currentProjectId = p.id;
      persist(); renderAll();
    });

    els.addTaskBtn.addEventListener("click", () => {
      const proj = currentProject(); if (!proj) return;
      const t = newTodoPrompt(); if (!t) return;
      proj.add(t);
      persist(); renderTasks();
    });
  };

  const renderAll = () => { renderProjects(); renderTasks(); };

  const init = () => {
    const { projects: loaded, currentId } = Storage.load();
    projects = loaded; currentProjectId = currentId;
    bindEvents(); renderAll();
  };

  return { init };
})();