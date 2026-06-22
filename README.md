# Student Portfolio and Academic Management Website

This project implements a responsive web application for managing a student portfolio and academic records with role-based access for **Admin** and **Student** users.

## Core Requirements

- Student profile management
- Academic record management
- Portfolio project management
- Authentication
- Admin/Student role-based access control
- Responsive UI for desktop/tablet/mobile

## Existing Structure Review

Initial repository state only contained `README.md`, so the website structure was added from scratch as:

- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/index.html`
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/style.css`
- `/home/runner/work/skills-copilot-codespaces-vscode/skills-copilot-codespaces-vscode/script.js`

## Confirmed Architecture

- **Frontend:** Vanilla HTML/CSS/JavaScript single-page app
- **State/Data:** Browser `localStorage` for profile, portfolio, and academic records; `sessionStorage` for active session
- **Auth flow:** Local demo credential check, role assignment, session persistence while tab is open
- **Role model:**  
  - **Admin:** full CRUD for profile, projects, records  
  - **Student:** read-only access to managed data

## Milestones and Acceptance Criteria

1. **UI Foundation**
   - Shared layout with responsive cards and forms
   - Acceptance: usable on narrow and wide screens
2. **Student Portfolio Module**
   - Add/edit/delete projects with title, description, technologies, link
   - Acceptance: CRUD works and list updates immediately
3. **Academic Management Module**
   - Add/edit/delete records with course, semester, grade, credits
   - Acceptance: validation prevents invalid grades/credits, CRUD updates UI
4. **Integration**
   - Unified auth/session + role-aware controls across modules
   - Acceptance: admin can mutate data, student cannot
5. **Validation**
   - Manual verification of login/logout, role restrictions, CRUD, responsive behavior
   - Acceptance: all key flows execute without runtime errors

## Demo Credentials

- Admin: `admin` / `admin123`
- Student: `student` / `student123`
