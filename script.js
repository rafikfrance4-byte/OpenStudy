
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

let tasks = JSON.parse(localStorage.getItem("openStudyTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("openStudyTasks", JSON.stringify(tasks));
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    remainingTasks.textContent = tasks.length - completed;
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty-message">Aucune tâche pour le moment.</p>';
        updateStats();
        return;
    }

    filteredTasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const details = document.createElement("p");
        details.textContent =
            (task.subject || "Sans matière") +
            (task.date ? " • " + task.date : "");

        info.append(title, details);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = task.completed ? "Annuler" : "Terminer";

        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Supprimer";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        item.append(info, actions);
        taskList.appendChild(item);
    });

    updateStats();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    const newTask = {
        id: Date.now(),
        title: title,
        subject: subjectInput.value.trim(),
        date: dateInput.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    taskForm.reset();
    renderTasks();
});

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

renderTasks();
