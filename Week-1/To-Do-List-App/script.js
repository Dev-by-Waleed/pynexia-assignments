const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const template = document.getElementById("task-template");
const emptyState = document.getElementById("empty-state");
const footer = document.getElementById("app-footer");
const countLabel = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");

const STORAGE_KEY = "tasks";

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function render() {
  list.textContent = "";

  tasks.forEach((task) => {
    const row = template.content.firstElementChild.cloneNode(true);

    const checkbox = row.querySelector(".task-item__checkbox");
    const text = row.querySelector(".task-item__text");
    const editInput = row.querySelector(".task-item__edit-input");
    const editBtn = row.querySelector(".icon-button--edit");
    const deleteBtn = row.querySelector(".icon-button--delete");

    row.dataset.id = task.id;
    text.textContent = task.text;
    editInput.value = task.text;
    checkbox.checked = task.done;
    row.classList.toggle("is-completed", task.done);

    checkbox.addEventListener("change", () => toggleTask(task, row, checkbox.checked));
    editBtn.addEventListener("click", () => startEditing(row, task, editInput));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        editInput.blur();
      } else if (event.key === "Escape") {
        editInput.value = task.text;
        editInput.blur();
      }
    });
    editInput.addEventListener("blur", () => commitEdit(row, task, editInput));

    list.appendChild(row);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;

  emptyState.hidden = total > 0;
  footer.hidden = total === 0;
  clearCompletedBtn.disabled = done === 0;
  countLabel.textContent = `${total} task${total === 1 ? "" : "s"} · ${done} done`;
}

function addTask(text) {
  tasks.push({ id: createId(), text, done: false });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function toggleTask(task, row, isDone) {
  task.done = isDone;
  row.classList.toggle("is-completed", isDone);
  saveTasks();
  updateStats();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
}

function startEditing(row, task, editInput) {
  row.classList.add("is-editing");
  editInput.value = task.text;
  editInput.focus();
  editInput.select();
}

function commitEdit(row, task, editInput) {
  if (!row.classList.contains("is-editing")) return;

  const newText = editInput.value.trim();
  row.classList.remove("is-editing");

  if (newText && newText !== task.text) {
    task.text = newText;
    row.querySelector(".task-item__text").textContent = newText;
    saveTasks();
  } else {
    editInput.value = task.text;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addTask(text);
  input.value = "";
  input.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

render();
