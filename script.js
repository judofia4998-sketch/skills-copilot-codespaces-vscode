const tasks = [];

function renderTasks(taskList) {
  const listElement = document.getElementById("task-list");
  if (!listElement) return;

  listElement.innerHTML = "";

  taskList.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const text = document.createElement("span");
    text.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = task.completed ? "Undo" : "Complete";
    toggleButton.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      renderTasks(tasks);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      renderTasks(tasks);
    });

    actions.append(toggleButton, deleteButton);
    item.append(text, actions);
    listElement.appendChild(item);
  });
}

const plannerForm = document.getElementById("planner-form");
if (plannerForm) {
  plannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("task-input");
    const title = input.value.trim();
    if (!title) return;

    tasks.push({ title, completed: false });
    input.value = "";
    renderTasks(tasks);
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\d+$/.test(phone);
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();
    const feedback = document.getElementById("form-feedback");

    if (!name || !email || !phone || !message) {
      feedback.textContent = "Please complete all fields.";
      feedback.style.color = "#b91c1c";
      return;
    }

    if (!validateEmail(email)) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.style.color = "#b91c1c";
      return;
    }

    if (!validatePhone(phone)) {
      feedback.textContent = "Phone number must contain digits only.";
      feedback.style.color = "#b91c1c";
      return;
    }

    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "#166534";
    contactForm.reset();
  });
}
