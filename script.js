document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImg = document.querySelector(".empty-img");
  const toDosContainer = document.querySelector(".todos-container");
  const inputForm = document.querySelector(".input-area");
  const progressBar = document.getElementById("progress");
  const progressNum = document.getElementById("numbers");

  const toggleEmptyState = () => {
    emptyImg.style.display = taskList.children.length === 0 ? "block" : "none";
    toDosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  const updateProgress = (checkCompletion = true) => {
    const totalTasks = taskList.children.length;
    const complpetedTaks =
      taskList.querySelectorAll(".checkbox:checked").length;

    progressBar.style.width = totalTasks
      ? `${(complpetedTaks / totalTasks) * 100}%`
      : "0%";
    progressNum.textContent = `${complpetedTaks} / ${totalTasks}`;

    if (checkCompletion && totalTasks > 0 && complpetedTaks === totalTasks) {
      commemoration();
    }
  };

  const saveTaskLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTaskFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(({ text, completed }) =>
      addTask(text, completed, false),
    );
    toggleEmptyState();
    updateProgress();
  };

  const addTask = (text, completed = false, checkCompletion = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
    <span>${taskText}</span>
    <div class="task-buttons">
        <button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    const checkBox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkBox.addEventListener("change", () => {
      const isChecked = checkBox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress();
      saveTaskLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkBox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
        saveTaskLocalStorage();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTaskLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
    updateProgress(checkCompletion);
    saveTaskLocalStorage();
  };

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
  });

  loadTaskFromLocalStorage();
});

const commemoration = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    zIndex: 999,
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 1.2,
      shapes: ["circle", "square"],
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
    });
    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 3,
      shapes: ["emoji"],
      shapeOptions: { emoji: { value: ["🦄", "🌈"] } },
    });
  }
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};
