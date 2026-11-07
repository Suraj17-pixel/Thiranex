# TaskMaster — Interactive JavaScript Logic & State Management Application

An interactive, responsive, client-side To-Do List application built with pure vanilla JavaScript, HTML5, and CSS3. Designed to demonstrate **DOM manipulation**, **event delegation**, **state-driven UI updates**, and **robust local storage data persistence**.

---

## 🌟 Key Highlights & Requirements Fulfilled

| Requirement | Implementation Detail |
|---|---|
| **Full CRUD** | **Create** with metadata (priority, category, due date); **Read** with dynamic badges; **Update** with checkbox toggles & inline edit mode (`Enter`/`Esc`); **Delete** with smooth removals and batch clear operations. |
| **Data Persistence** | Synchronized with `window.localStorage` upon every state mutation with fail-safe error handling and seed fallbacks. |
| **Advanced Filtering** | Filter by completion status (`All`, `Active`, `Completed`), priority (`High`, `Medium`, `Low`), and real-time live search query. |
| **Multi-Criteria Sorting** | Sort by Newest First, Oldest First, Due Date, Priority Rank, or Alphabetical (A-Z). |
| **Event Delegation** | `click`, `dblclick`, `change`, `submit` and `keydown` listeners are attached **once** to the stable `#taskList` parent, using `element.closest('[data-action]')` to capture interactions from dynamically created tasks without re-attaching on render. |
| **Productivity Analytics** | Real-time progress bar calculation, completion percentages, active counters, and overdue date alerts. |
| **Data Backup / Portability** | Native JSON Export & Import tools allowing backup, restore, and transfer across browsers. |
| **Theme System** | Seamless Dark / Light mode toggle persisted across sessions. |

---

## 📁 Project Architecture

```
Task-3/
├── index.html        # Semantic HTML5 layout, accessible form controls, and ARIA attributes
├── style.css         # Modern styling, custom properties, glassmorphism, transitions & dark mode
├── app.js            # Central state management, CRUD logic, event delegation, and persistence
└── README.md         # Comprehensive documentation and technical explanation
```

---

## 🧠 Core Engineering Concepts Demonstrated

### 1. Centralized State Architecture
Rather than directly mutating the DOM and reading values back from HTML nodes (which leads to synchronization bugs), this application follows a **single source of truth** pattern:
```javascript
const state = {
  tasks: [],            // List of all task objects
  filter: 'all',        // 'all' | 'active' | 'completed'
  priorityFilter: 'all',// 'all' | 'high' | 'medium' | 'low'
  sortBy: 'created-desc',
  searchQuery: '',
  editingTaskId: null,
  theme: 'light'
};
```
Whenever an action occurs:
1. Mutate `state` (or array within state).
2. Save state snapshot into `window.localStorage`.
3. Call `renderApp()` to project state into the DOM.

### 2. Event Delegation Pattern
Rather than attaching event listeners to each task's checkbox, edit button, and delete button individually (which consumes memory and breaks when elements are dynamically added or removed), the application attaches its listeners **once** to the stable `#taskList` container and resolves the intended action with `element.closest('[data-action]')`:
```javascript
DOM.taskList.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;
  const taskId = taskItem.dataset.id;

  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  if (action === 'delete-task') {
    deleteTask(taskId);
  } else if (action === 'start-edit') {
    state.editingTaskId = taskId;
    renderApp();
  } else if (action === 'cancel-edit') {
    state.editingTaskId = null;
    renderApp();
    focusTaskEditButton(taskId);
  }
});
```
Because `renderApp()` only rebuilds the list contents, the delegated listeners on `#taskList` keep working for every dynamically created task and are never re-registered, so no duplicate handlers accumulate.

### 3. Resilient Local Storage Integration
Data serialization and deserialization are handled safely with standard `try...catch` blocks to protect against parsing errors, corrupt payloads (falling back to sanitized seed data) or storage quota limitations:
```javascript
function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (error) {
    const reason = (error && (error.name === 'QuotaExceededError' || error.code === 22))
      ? 'storage quota exceeded'
      : 'storage unavailable';
    console.error('Failed to save tasks to localStorage:', error);
    showToast(`Failed to save to local storage (${reason})`, 'danger');
  }
}
```

---

## 🚀 How to Run the Application

1. **Directly in the Browser**:
   - Double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).
2. **Via Live Server (VS Code / Antigravity)**:
   - Serve the directory using any HTTP server:
     ```bash
     npx serve .
     # or
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your browser.

---

## ⌨️ Keyboard Shortcuts
- <kbd>Enter</kbd> : Submit new task / Save inline edited task.
- <kbd>Esc</kbd> : Cancel inline task edit.
- <kbd>/</kbd> : Quick focus on the search bar.
