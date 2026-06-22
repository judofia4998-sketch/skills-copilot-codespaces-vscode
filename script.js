const USERS = {
  admin: { password: "admin123", role: "admin", name: "Administrator" },
  student: { password: "student123", role: "student", name: "Student User" }
};

const STORAGE_KEY = "studentPortfolioData";
const SESSION_KEY = "studentPortfolioSession";

const defaultData = {
  profile: {
    name: "Alex Johnson",
    email: "alex@example.edu",
    program: "Computer Science",
    bio: "Student focused on software engineering and UI development."
  },
  projects: [
    {
      id: crypto.randomUUID(),
      title: "Campus Navigator App",
      description: "Mobile-friendly app to locate campus facilities.",
      tech: "HTML, CSS, JavaScript",
      link: "https://example.com/campus-app"
    }
  ],
  records: [
    {
      id: crypto.randomUUID(),
      course: "Web Development",
      semester: "Fall 2026",
      grade: "A",
      credits: 3
    }
  ]
};

const gradePattern = /^(A|A-|B\+|B|B-|C\+|C|C-|D|F)$/i;

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const authCard = document.getElementById("auth-card");
const dashboard = document.getElementById("dashboard");
const userNameEl = document.getElementById("user-name");
const userRoleEl = document.getElementById("user-role");
const logoutBtn = document.getElementById("logout-btn");

const profileForm = document.getElementById("profile-form");
const projectForm = document.getElementById("project-form");
const projectList = document.getElementById("project-list");
const recordForm = document.getElementById("record-form");
const recordTableBody = document.getElementById("record-table-body");

function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }
  return JSON.parse(raw);
}

function setData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(session) {
  if (session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

function isAdmin() {
  const session = getSession();
  return session?.role === "admin";
}

function canEdit() {
  return isAdmin();
}

function setFormAccess() {
  const editable = canEdit();
  [profileForm, projectForm, recordForm].forEach((form) => {
    [...form.elements].forEach((element) => {
      if (element.tagName === "BUTTON" || element.type === "hidden") return;
      element.disabled = !editable;
    });
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = !editable;
  });
}

function renderProfile() {
  const data = getData();
  document.getElementById("profile-name").value = data.profile.name;
  document.getElementById("profile-email").value = data.profile.email;
  document.getElementById("profile-program").value = data.profile.program;
  document.getElementById("profile-bio").value = data.profile.bio;
}

function createActionButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = text;
  btn.className = className;
  btn.disabled = !canEdit();
  btn.addEventListener("click", onClick);
  return btn;
}

function renderProjects() {
  const data = getData();
  projectList.innerHTML = "";
  if (data.projects.length === 0) {
    projectList.innerHTML = "<p class='hint'>No projects yet.</p>";
    return;
  }

  data.projects.forEach((project) => {
    const wrapper = document.createElement("article");
    wrapper.className = "project-item";
    wrapper.innerHTML = `
      <h4>${project.title}</h4>
      <p>${project.description}</p>
      <p><strong>Tech:</strong> ${project.tech}</p>
      ${project.link ? `<p><a href="${project.link}" target="_blank" rel="noopener noreferrer">Project Link</a></p>` : ""}
    `;

    const actions = document.createElement("div");
    actions.className = "project-actions";
    actions.append(
      createActionButton("Edit", "secondary", () => loadProject(project.id)),
      createActionButton("Delete", "danger", () => removeProject(project.id))
    );
    wrapper.append(actions);
    projectList.append(wrapper);
  });
}

function renderRecords() {
  const data = getData();
  recordTableBody.innerHTML = "";
  data.records.forEach((record) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.course}</td>
      <td>${record.semester}</td>
      <td>${record.grade}</td>
      <td>${record.credits}</td>
      <td></td>
    `;
    const actionCell = tr.querySelector("td:last-child");
    const actions = document.createElement("div");
    actions.className = "row-actions";
    actions.append(
      createActionButton("Edit", "secondary", () => loadRecord(record.id)),
      createActionButton("Delete", "danger", () => removeRecord(record.id))
    );
    actionCell.append(actions);
    recordTableBody.append(tr);
  });
}

function refreshDashboard() {
  const session = getSession();
  if (!session) return;
  userNameEl.textContent = session.name;
  userRoleEl.textContent = session.role;
  renderProfile();
  renderProjects();
  renderRecords();
  setFormAccess();
}

function loadProject(id) {
  const data = getData();
  const project = data.projects.find((item) => item.id === id);
  if (!project) return;
  document.getElementById("project-id").value = project.id;
  document.getElementById("project-title").value = project.title;
  document.getElementById("project-description").value = project.description;
  document.getElementById("project-tech").value = project.tech;
  document.getElementById("project-link").value = project.link || "";
}

function removeProject(id) {
  if (!canEdit()) return;
  const data = getData();
  data.projects = data.projects.filter((item) => item.id !== id);
  setData(data);
  renderProjects();
}

function loadRecord(id) {
  const data = getData();
  const record = data.records.find((item) => item.id === id);
  if (!record) return;
  document.getElementById("record-id").value = record.id;
  document.getElementById("record-course").value = record.course;
  document.getElementById("record-semester").value = record.semester;
  document.getElementById("record-grade").value = record.grade;
  document.getElementById("record-credits").value = record.credits;
}

function removeRecord(id) {
  if (!canEdit()) return;
  const data = getData();
  data.records = data.records.filter((item) => item.id !== id);
  setData(data);
  renderRecords();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const user = USERS[username];

  if (!user || user.password !== password) {
    loginMessage.textContent = "Invalid username or password.";
    return;
  }

  setSession({ username, role: user.role, name: user.name });
  loginMessage.textContent = "";
  authCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  refreshDashboard();
  loginForm.reset();
});

logoutBtn.addEventListener("click", () => {
  setSession(null);
  dashboard.classList.add("hidden");
  authCard.classList.remove("hidden");
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canEdit()) return;
  const data = getData();
  data.profile = {
    name: document.getElementById("profile-name").value.trim(),
    email: document.getElementById("profile-email").value.trim(),
    program: document.getElementById("profile-program").value.trim(),
    bio: document.getElementById("profile-bio").value.trim()
  };
  setData(data);
});

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canEdit()) return;
  const id = document.getElementById("project-id").value || crypto.randomUUID();
  const project = {
    id,
    title: document.getElementById("project-title").value.trim(),
    description: document.getElementById("project-description").value.trim(),
    tech: document.getElementById("project-tech").value.trim(),
    link: document.getElementById("project-link").value.trim()
  };
  const data = getData();
  const index = data.projects.findIndex((item) => item.id === id);
  if (index >= 0) {
    data.projects[index] = project;
  } else {
    data.projects.push(project);
  }
  setData(data);
  projectForm.reset();
  document.getElementById("project-id").value = "";
  renderProjects();
});

recordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canEdit()) return;
  const grade = document.getElementById("record-grade").value.trim();
  const credits = Number(document.getElementById("record-credits").value);
  if (!gradePattern.test(grade)) {
    alert("Grade must be one of A, A-, B+, B, B-, C+, C, C-, D, F.");
    return;
  }
  if (!Number.isInteger(credits) || credits < 1 || credits > 10) {
    alert("Credits must be a whole number between 1 and 10.");
    return;
  }

  const id = document.getElementById("record-id").value || crypto.randomUUID();
  const record = {
    id,
    course: document.getElementById("record-course").value.trim(),
    semester: document.getElementById("record-semester").value.trim(),
    grade: grade.toUpperCase(),
    credits
  };

  const data = getData();
  const index = data.records.findIndex((item) => item.id === id);
  if (index >= 0) {
    data.records[index] = record;
  } else {
    data.records.push(record);
  }
  setData(data);
  recordForm.reset();
  document.getElementById("record-id").value = "";
  renderRecords();
});

function init() {
  getData();
  const session = getSession();
  if (session) {
    authCard.classList.add("hidden");
    dashboard.classList.remove("hidden");
    refreshDashboard();
  }
}

init();
