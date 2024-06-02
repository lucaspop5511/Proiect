document.addEventListener('DOMContentLoaded', loadTasks);

const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task-button');
const validationMessage = document.getElementById('validation-message');

addTaskButton.addEventListener('click', handleAddTask);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function handleAddTask(event) {
    if (event.type === 'click' || event.key === 'Enter') {
        addTask();
    }
}

function addTask() {
    if (!validateLastTask()) {
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
    clearValidationMessage();
}

function validateLastTask() {
    const tasks = Array.from(document.querySelectorAll('.task'));
    if (tasks.length === 0) return true;

    const lastTask = tasks[tasks.length - 1];
    const title = lastTask.querySelector('input').value.trim();
    const description = lastTask.querySelector('textarea').value.trim();

    if (title === '' || description === '') {
        showValidationMessage('Please complete the title and description.');
        return false;
    }

    clearValidationMessage();
    return true;
}

function showValidationMessage(message) {
    validationMessage.textContent = message;
}

function clearValidationMessage() {
    validationMessage.textContent = '';
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
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
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
