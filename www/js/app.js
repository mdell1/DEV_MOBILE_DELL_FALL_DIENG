document.addEventListener('deviceready', init, false);
document.addEventListener('DOMContentLoaded', init, false); // fallback navigateur

let tasks = [];
let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;

  // Charger les tâches sauvegardées
  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);
  render();

  document.getElementById('addBtn').addEventListener('click', addTask);
  document.getElementById('taskInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTask();
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  const list = document.getElementById('taskList');
  const count = document.getElementById('count');

  list.innerHTML = tasks.map(t => `
    <li class="${t.done ? 'done' : ''}">
      <input type="checkbox" ${t.done ? 'checked' : ''}
             onchange="toggleTask(${t.id})" />
      <span>${escape(t.text)}</span>
      <button class="del" onclick="deleteTask(${t.id})">✕</button>
    </li>
  `).join('');

  const remaining = tasks.filter(t => !t.done).length;
  count.textContent = `${remaining} restante(s)`;
}

function escape(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}