document.addEventListener('DOMContentLoaded', loadTasks);

const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task-button');

addTaskButton.addEventListener('click', addTask);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask() {
    if (!validateLastTask()) {
        alert('Please complete the previous task before adding a new one.');
        return;
    }

    const task = {
        id: Date.now(),
        title: '',
        description: '',
        completed: false
    };

    displayTask(task);
    saveTask(task);
}

function validateLastTask() {
    const tasks = Array.from(document.querySelectorAll('.task'));
    if (tasks.length === 0) return true;

    const lastTask = tasks[tasks.length - 1];
    const title = lastTask.querySelector('input').value.trim();
    const description = lastTask.querySelector('textarea').value.trim();

    return title !== '' && description !== '';
}

function displayTask(task) {
    const li = document.createElement('li');
    li.className = 'task';
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.onclick = () => toggleComplete(task.id);

    const content = document.createElement('div');
    content.className = 'content';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = task.title;
    titleInput.placeholder = 'Title';
    titleInput.oninput = () => updateTask(task.id, 'title', titleInput.value);

    const descInput = document.createElement('textarea');
    descInput.value = task.description;
    descInput.placeholder = 'Description';
    descInput.oninput = () => updateTask(task.id, 'description', descInput.value);
    descInput.addEventListener('input', autoResize);

    content.appendChild(titleInput);
    content.appendChild(descInput);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteTask(task.id);

    li.appendChild(circle);
    li.appendChild(content);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(id, field, value) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(task => task.id === id);
    task[field] = value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskItem = document.querySelector(`[data-id='${id}']`);
    taskList.removeChild(taskItem);
}

function toggleComplete(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskItem = document.querySelector(`[data-id='${id}']`);
    taskItem.classList.toggle('completed');
}
