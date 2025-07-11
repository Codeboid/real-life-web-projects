const input = document.getElementById("goal-input");
const addBtn = document.getElementById("add-btn");
const goalList = document.getElementById("goal-list");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

function renderGoals() {
    goalList.innerHTML = "";
    goals.forEach((goal, index) => {
        const li = document.createElement("li");
        li.className = goal.completed ? "completed" : "";

        const span = document.createElement("span");
        span.textContent = goal.text;
        span.onclick = () => toggleComplete(index);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteGoal(index);

        li.appendChild(span);
        li.appendChild(delBtn);
        goalList.appendChild(li);
    });
}

function addGoal() {
    const text = input.value.trim();
    if (text !== "") {
        goals.push({text, completed: false});
        saveGoals();
        renderGoals();
        input.value = "";
    }
}

function deleteGoal(index) {
    goals.splice(index, 1);
    saveGoals();
    renderGoals();
}

function toggleComplete(index) {
    goals[index].completed = !goals[index].completed;
    saveGoals();
    renderGoals();
}

addBtn.addEventListener("click", addGoal);
window.addEventListener("load", renderGoals);