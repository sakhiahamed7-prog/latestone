const STORAGE_KEY = "ledger-tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const countLabel = document.getElementById("count-label");
const clearDoneBtn = document.getElementById("clear-done");

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task";

    const check = document.createElement("button");
    check.type = "button";
    check.className = "task__check" + (task.done ? " task__check--checked" : "");
    check.setAttribute("aria-label", task.done ? "Mark as not done" : "Mark as done");
    check.addEventListener("click", () => toggleTask(task.id));

    const label = document.createElement("span");
    label.className = "task__label" + (task.done ? " task__label--done" : "");
    label.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "task__remove";
    remove.setAttribute("aria-label", "Remove task");
    remove.textContent = "×";
    remove.addEventListener("click", () => removeTask(task.id));

    li.append(check, label, remove);
    list.appendChild(li);
  });

  emptyState.style.display = tasks.length === 0 ? "block" : "none";

  const remaining = tasks.filter((t) => !t.done).length;
  countLabel.textContent = `${remaining} task${remaining === 1 ? "" : "s"}`;
}

function addTask(text) {
  tasks.push({ id: Date.now().toString(), text, done: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTasks();
  render();
}

function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

clearDoneBtn.addEventListener("click", clearCompleted);

render();
