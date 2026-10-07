// Get elements from HTML
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const filters = document.querySelectorAll(".filter");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display tasks when page loads
displayTasks();

// Add task
addBtn.addEventListener("click", addTask);

// Allow Enter key to add task
taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Function to add a task
function addTask() {

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskInput.value = "";
}

// Display tasks
function displayTasks(filter = "all") {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {

        // Create list item
        const li = document.createElement("li");
        li.classList.add("task");

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Create task text
        const span = document.createElement("span");
        span.textContent = task.text;
        span.classList.add("task-text");

        if (task.completed) {
            span.classList.add("completed");
        }

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        // Mark task completed
        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            displayTasks(filter);
        });

        // Delete task
        deleteBtn.addEventListener("click", function() {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();
            displayTasks(filter);
        });

        // Add elements to list item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        // Add list item to webpage
        taskList.appendChild(li);
    });

    updateCounter();
}

// Update pending task counter
function updateCounter() {

    const pendingTasks = tasks.filter(task => !task.completed).length;

    counter.textContent = "Pending Tasks: " + pendingTasks;
}

// Save tasks in localStorage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter buttons
filters.forEach(button => {

    button.addEventListener("click", function() {

        // Remove active class from all buttons
        filters.forEach(btn => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        const filter = button.dataset.filter;

        displayTasks(filter);
    });
});
