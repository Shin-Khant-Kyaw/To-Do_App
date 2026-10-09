const addingTask = document.getElementById("addNewTask");
const addNewTaskContainer = document.getElementById("addNewTaskContainer");
const allToDoContainer = document.getElementById("allToDoContainer");
const newTaskForm = document.getElementById("newTask");

let taskLists = JSON.parse(localStorage.getItem("myTasks")) || [];

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

function initSegmentedControl(container) {
    const glider = container.querySelector('.segmented-glider');
    const inputs = container.querySelectorAll('.segmented-input');
    const labels = container.querySelectorAll('.segmented-option');

    function updateGliderPosition() {
        const checkedInput = container.querySelector('.segmented-input:checked');
        if (!checkedInput) return;

        const activeLabel = container.querySelector(`label[for="${checkedInput.id}"]`);
        if (activeLabel && glider) {
            glider.style.width = `${activeLabel.offsetWidth}px`;
            glider.style.transform = `translateX(${activeLabel.offsetLeft}px)`;
        }

        labels.forEach(label => {
            const input = document.getElementById(label.getAttribute('for'));
            if (input && input.checked) {
                label.classList.add('is-active');
            } else {
                label.classList.remove('is-active');
            }
        });
    }

    inputs.forEach(input => input.addEventListener('change', updateGliderPosition));
    window.addEventListener('resize', updateGliderPosition);
    updateGliderPosition();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.segmented-control-wrapper').forEach(initSegmentedControl);

    // Clear static HTML placeholder
    if (allToDoContainer) {
        allToDoContainer.innerHTML = "";
    }

    // Render all items saved in localStorage
    taskLists.forEach(taskText => {
        renderTaskOnScreen(taskText);
    });
});

newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    addTask();
});

function cancelTask() {
    addingTask.style.display = "none";
    addNewTaskContainer.style.display = "";
}

function addNewTask() {
    addingTask.style.display = "flex";
    addNewTaskContainer.style.display = "none";
}

function addTask() {
    const addTitle = document.getElementById("addTitle");
    const value = addTitle.value.trim();

    if (!value) return;

    addTitle.value = "";
    addingTask.style.display = "none";
    addNewTaskContainer.style.display = "";

    // FIXED: Use .push() instead of calling taskLists as a function
    taskLists.push(value);
    localStorage.setItem("myTasks", JSON.stringify(taskLists));
    renderTaskOnScreen(value);
}

function renderTaskOnScreen(value) {
    const newText = document.createElement("p");
    newText.className = "to-do mb-0";
    newText.textContent = value;

    const newIconCheck = document.createElement("i");
    newIconCheck.className = "fa-solid fa-check fa-xs";

    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.className = "rounded-circle text-center d-flex align-items-center justify-content-center";
    newButton.style.width = "20px";
    newButton.style.height = "20px";
    newButton.appendChild(newIconCheck);

    const newToDoContainer = document.createElement("div");
    newToDoContainer.className = "to-do-container d-flex align-items-center gap-4 py-lg-2";
    newToDoContainer.appendChild(newButton);
    newToDoContainer.appendChild(newText);

    // FIXED: Pass both the task text value and the DOM element reference ('this')
    newToDoContainer.addEventListener("click", function() {
        delTask(value, this);
    });

    const newDivider = document.createElement("hr");
    newDivider.className = "divider";

    const newToDoHolder = document.createElement("div");
    newToDoHolder.className = "to-do-holder d-flex flex-column";
    newToDoHolder.appendChild(newToDoContainer);
    newToDoHolder.appendChild(newDivider);

    allToDoContainer.appendChild(newToDoHolder);
}

// FIXED: Accept taskText parameter to filter the array correctly
function delTask(taskText, element) {
    taskLists = taskLists.filter(item => item !== taskText);
    localStorage.setItem("myTasks", JSON.stringify(taskLists));
    
    const holder = element.closest('.to-do-holder');
    if (holder) {
        holder.remove();
    }
}