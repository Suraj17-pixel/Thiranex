/**
 * TaskMaster — Advanced Client-Side State Management & To-Do Application
 * 
 * Features:
 * - State-Driven UI Architecture
 * - Full CRUD Operations (Create, Read, Update, Delete)
 * - Automatic window.localStorage Persistence with Fallbacks
 * - Advanced Multi-Criteria Filtering (Status, Priority, Search Query)
 * - Multi-Option Sorting (Date Created, Due Date, Priority, Alphabetical)
 * - Event Delegation Pattern on the Task List Container
 * - Inline Editing with Keyboard Shortcuts (Enter to save, Esc to cancel)
 * - Productivity Stats & Animated Completion Progress Bar
 * - JSON Export / Import for Data Backup and Migration
 */

'use strict';

// =============================================================================
// Constants & Configuration
// =============================================================================

const STORAGE_KEY = 'taskmaster_todos_v1';
const THEME_KEY = 'taskmaster_theme_pref';

const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1
};

// Rich initial demo seed tasks
const DEFAULT_SAMPLE_TASKS = [
  {
    id: 'demo-task-1',
    title: 'Master DOM Manipulation and Event Delegation in JavaScript',
    completed: true,
    priority: 'high',
    category: 'Study',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    createdAt: Date.now() - 172800000
  },
  {
    id: 'demo-task-2',
    title: 'Implement LocalStorage persistence with JSON serialization',
    completed: true,
    priority: 'high',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: Date.now() - 86400000
  },
  {
    id: 'demo-task-3',
    title: 'Build advanced filtering tabs (All, Active, Completed)',
    completed: false,
    priority: 'medium',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // In 2 days
    createdAt: Date.now() - 3600000
  },
  {
    id: 'demo-task-4',
    title: 'Evening workout session and 30-minute outdoor run',
    completed: false,
    priority: 'low',
    category: 'Health',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    createdAt: Date.now() - 1800000
  }
];

// =============================================================================
// Application State
// =============================================================================

const state = {
  tasks: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  priorityFilter: 'all', // 'all' | 'high' | 'medium' | 'low'
  sortBy: 'created-desc', // 'created-desc' | 'created-asc' | 'due-date' | 'priority' | 'alphabetical'
  searchQuery: '',
  editingTaskId: null,
  theme: 'light'
};

// =============================================================================
// DOM Selectors
// =============================================================================

const DOM = {
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  currentDateDisplay: document.getElementById('currentDateDisplay'),
  progressSummaryText: document.getElementById('progressSummaryText'),
  progressPercentage: document.getElementById('progressPercentage'),
  progressBarTrack: document.getElementById('progressBarTrack'),
  progressBarFill: document.getElementById('progressBarFill'),

  // Input Form
  taskForm: document.getElementById('taskForm'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  taskPrioritySelect: document.getElementById('taskPrioritySelect'),
  taskCategorySelect: document.getElementById('taskCategorySelect'),
  taskDueDateInput: document.getElementById('taskDueDateInput'),

  // Search & Filter Controls
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  filterTabs: document.querySelectorAll('.filter-tab'),
  filterPrioritySelect: document.getElementById('filterPrioritySelect'),
  sortSelect: document.getElementById('sortSelect'),

  // Badges
  countAll: document.getElementById('countAll'),
  countActive: document.getElementById('countActive'),
  countCompleted: document.getElementById('countCompleted'),

  // Task List & View Header
  currentViewTitle: document.getElementById('currentViewTitle'),
  filterStatusIndicator: document.getElementById('filterStatusIndicator'),
  taskList: document.getElementById('taskList'),
  emptyState: document.getElementById('emptyState'),
  emptyStateTitle: document.getElementById('emptyStateTitle'),
  emptyStateMessage: document.getElementById('emptyStateMessage'),

  // Action Buttons
  markAllCompleteBtn: document.getElementById('markAllCompleteBtn'),
  clearCompletedBtn: document.getElementById('clearCompletedBtn'),
  itemsLeftCount: document.getElementById('itemsLeftCount'),

  // Data Tools
  exportDataBtn: document.getElementById('exportDataBtn'),
  importFileInput: document.getElementById('importFileInput'),
  resetDemoBtn: document.getElementById('resetDemoBtn'),
  toastContainer: document.getElementById('toastContainer')
};

// =============================================================================
// Persistence Layer (LocalStorage)
// =============================================================================

/**
 * Loads tasks and preferences from window.localStorage.
 */
function loadStateFromStorage() {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
      const parsed = JSON.parse(serializedData);
      if (Array.isArray(parsed)) {
        state.tasks = sanitizeTasks(parsed);
      } else {
        // Unexpected structure: fall back to seed data
        state.tasks = cloneDefaultTasks();
      }
    } else {
      // First time user: seed sample demo tasks
      state.tasks = cloneDefaultTasks();
      saveStateToStorage();
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage, re-seeding defaults:', error);
    state.tasks = cloneDefaultTasks();
    // Overwrite corrupt / unreadable data with a clean snapshot
    saveStateToStorage();
  }

  // Load Theme (guarded: unavailable storage must never break startup)
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  } catch (error) {
    console.error('Failed to read theme preference:', error);
  }
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
}

/**
 * Saves current tasks array to window.localStorage.
 */
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

// =============================================================================
// Theme Handling
// =============================================================================

function applyTheme(theme) {
  state.theme = theme === 'dark' ? 'dark' : 'light';
  if (state.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem(THEME_KEY, state.theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}

function toggleTheme() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  showToast(`Switched to ${nextTheme} mode`, 'default');
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generates an RFC-compliant or collision-resistant unique identifier.
 */
function generateId() {
  return 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Sanitizes strings for safe insertion into HTML.
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Restricts a priority value to the known set (never trust stored/imported data).
 */
function normalizePriority(value) {
  return Object.prototype.hasOwnProperty.call(PRIORITY_WEIGHTS, value) ? value : 'medium';
}

/**
 * Deep-copies the built-in demo seeds so runtime mutations (toggle/edit)
 * never leak into the reusable fallback data.
 */
function cloneDefaultTasks() {
  return DEFAULT_SAMPLE_TASKS.map(task => ({ ...task }));
}

/**
 * Coerces a raw task payload (localStorage / imported JSON) into a safe,
 * well-formed task object. Returns null when the payload is unusable.
 */
function normalizeTask(raw, seenIds) {
  if (!raw || typeof raw !== 'object') return null;

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null;

  const rawId = typeof raw.id === 'string' ? raw.id.trim() : '';
  let id = rawId || generateId();
  if (seenIds.has(id)) id = generateId();
  seenIds.add(id);

  const dueDateMatch = typeof raw.dueDate === 'string'
    ? raw.dueDate.match(/^\d{4}-\d{2}-\d{2}/)
    : null;

  return {
    id,
    title,
    completed: Boolean(raw.completed),
    priority: normalizePriority(raw.priority),
    category: (typeof raw.category === 'string' && raw.category.trim()) ? raw.category.trim() : 'General',
    dueDate: dueDateMatch ? dueDateMatch[0] : '',
    createdAt: (typeof raw.createdAt === 'number' && isFinite(raw.createdAt)) ? raw.createdAt : Date.now()
  };
}

/**
 * Sanitizes an entire task array: drops invalid entries and guarantees
 * unique ids so rendering, sorting and searching can never crash.
 */
function sanitizeTasks(rawList) {
  const seenIds = new Set();
  const cleaned = [];
  rawList.forEach(raw => {
    const task = normalizeTask(raw, seenIds);
    if (task) cleaned.push(task);
  });
  return cleaned;
}

/**
 * Displays an ephemeral toast message.
 */
function showToast(message, type = 'default') {
  const toast = document.createElement('div');
  toast.className = `toast ${type !== 'default' ? 'toast-' + type : ''}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'danger') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
  DOM.toastContainer.appendChild(toast);

  // Auto clean up after animation completes
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

/**
 * Formats due date into human readable badge text and status.
 */
function formatDueDate(dueDateStr) {
  if (!dueDateStr) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const options = { month: 'short', day: 'numeric' };
  const formattedText = targetDate.toLocaleDateString(undefined, options);

  if (diffDays < 0) {
    return { text: `Overdue (${formattedText})`, className: 'is-overdue' };
  } else if (diffDays === 0) {
    return { text: `Due Today`, className: 'is-today' };
  } else if (diffDays === 1) {
    return { text: `Due Tomorrow`, className: '' };
  } else {
    return { text: `Due ${formattedText}`, className: '' };
  }
}

// =============================================================================
// CRUD Operations (State Mutators)
// =============================================================================

/**
 * CREATE: Adds a new task to the state.
 */
function addTask(title, priority = 'medium', category = 'General', dueDate = '') {
  const trimmed = (typeof title === 'string') ? title.trim() : '';
  if (!trimmed) {
    showToast('Task title cannot be empty', 'warning');
    return false;
  }

  const newTask = {
    id: generateId(),
    title: trimmed,
    completed: false,
    priority: normalizePriority(priority),
    category: (typeof category === 'string' && category.trim()) ? category.trim() : 'General',
    dueDate: (typeof dueDate === 'string') ? dueDate : '',
    createdAt: Date.now()
  };

  state.tasks.unshift(newTask);
  state.editingTaskId = null; // unrelated mutation ends any inline edit
  saveStateToStorage();
  renderApp();
  showToast('Task added successfully', 'success');
  return true;
}

/**
 * UPDATE: Toggles task completion.
 */
function toggleTaskCompletion(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  state.editingTaskId = null; // unrelated mutation ends any inline edit
  saveStateToStorage();
  renderApp();

  if (task.completed) {
    showToast('Task marked as completed! 🎉', 'success');
  }
}

/**
 * UPDATE: Updates task details (title, priority, etc.).
 */
function updateTaskTitle(taskId, newTitle) {
  const trimmed = (typeof newTitle === 'string') ? newTitle.trim() : '';
  if (!trimmed) {
    showToast('Task title cannot be empty', 'warning');
    return false;
  }

  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return false;

  task.title = trimmed;
  state.editingTaskId = null;
  saveStateToStorage();
  renderApp();
  showToast('Task updated', 'success');
  return true;
}

/**
 * DELETE: Removes a single task.
 */
function deleteTask(taskId) {
  const index = state.tasks.findIndex(t => t.id === taskId);
  if (index === -1) return;

  state.tasks.splice(index, 1);
  // Always end inline editing: a re-render would otherwise rebuild the edit
  // form from the stored title and silently discard unsaved keystrokes.
  state.editingTaskId = null;
  saveStateToStorage();
  renderApp();
  showToast('Task removed', 'danger');
}

/**
 * BATCH UPDATE: Mark all filtered tasks complete.
 */
function markAllComplete() {
  const filtered = getFilteredTasks();
  if (filtered.length === 0) return;

  let changedCount = 0;
  filtered.forEach(task => {
    if (!task.completed) {
      task.completed = true;
      changedCount++;
    }
  });

  if (changedCount > 0) {
    state.editingTaskId = null; // unrelated mutation ends any inline edit
    saveStateToStorage();
    renderApp();
    showToast(`Marked ${changedCount} task(s) complete`, 'success');
  } else {
    showToast('All items are already completed', 'default');
  }
}

/**
 * BATCH DELETE: Clear all completed tasks.
 */
function clearCompletedTasks() {
  const completedCount = state.tasks.filter(t => t.completed).length;
  if (completedCount === 0) {
    showToast('No completed tasks to clear', 'warning');
    return;
  }

  state.tasks = state.tasks.filter(t => !t.completed);
  state.editingTaskId = null; // unrelated mutation ends any inline edit
  saveStateToStorage();
  renderApp();
  showToast(`Cleared ${completedCount} completed task(s)`, 'default');
}

// =============================================================================
// Filter & Sort Engine
// =============================================================================

function getFilteredTasks() {
  let list = [...state.tasks];

  // 1. Status Filter
  if (state.filter === 'active') {
    list = list.filter(t => !t.completed);
  } else if (state.filter === 'completed') {
    list = list.filter(t => t.completed);
  }

  // 2. Priority Filter
  if (state.priorityFilter !== 'all') {
    list = list.filter(t => t.priority === state.priorityFilter);
  }

  // 3. Search Query Filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q)
    );
  }

  // 4. Sorting
  list.sort((a, b) => {
    switch (state.sortBy) {
      case 'created-asc':
        return a.createdAt - b.createdAt;
      case 'created-desc':
        return b.createdAt - a.createdAt;
      case 'priority': {
        const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
        const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
        return weightB - weightA;
      }
      case 'due-date': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return b.createdAt - a.createdAt;
    }
  });

  return list;
}

// =============================================================================
// Render Engine (DOM Manipulation)
// =============================================================================

/**
 * Primary render function. Synchronizes current state to all UI elements.
 */
function renderApp() {
  const totalCount = state.tasks.length;
  const completedCount = state.tasks.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;

  // 1. Update Progress Statistics
  DOM.countAll.textContent = totalCount;
  DOM.countActive.textContent = activeCount;
  DOM.countCompleted.textContent = completedCount;

  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  DOM.progressPercentage.textContent = `${percentage}%`;
  DOM.progressBarFill.style.width = `${percentage}%`;
  DOM.progressBarTrack.setAttribute('aria-valuenow', String(percentage));
  DOM.progressSummaryText.textContent = `${completedCount} of ${totalCount} task${totalCount === 1 ? '' : 's'} completed`;

  DOM.itemsLeftCount.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} remaining`;

  // 2. Update Header Titles & View Badges
  const filterNames = {
    all: 'All Tasks',
    active: 'Active Tasks',
    completed: 'Completed Tasks'
  };
  DOM.currentViewTitle.textContent = filterNames[state.filter] || 'Tasks';

  // Keep the filter tab visuals & ARIA state in sync with the state tree
  DOM.filterTabs.forEach(tab => {
    const isActive = tab.dataset.filter === state.filter;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });

  let filterStatusText = `Showing ${state.filter} tasks`;
  if (state.priorityFilter !== 'all') {
    filterStatusText += ` • ${state.priorityFilter} priority`;
  }
  if (state.searchQuery) {
    filterStatusText += ` • matching "${state.searchQuery}"`;
  }
  DOM.filterStatusIndicator.textContent = filterStatusText;

  // 3. Render Filtered Tasks List
  const filteredTasks = getFilteredTasks();

  // If the task being edited is no longer visible (filter/search changed,
  // task deleted or imported), silently drop edit mode instead of leaving a
  // stale edit target behind.
  if (state.editingTaskId && !filteredTasks.some(t => t.id === state.editingTaskId)) {
    state.editingTaskId = null;
  }

  DOM.taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    DOM.emptyState.hidden = false;
    if (state.searchQuery) {
      DOM.emptyStateTitle.textContent = 'No matching tasks found';
      DOM.emptyStateMessage.textContent = `No tasks matched your search query "${state.searchQuery}". Try a different keyword.`;
    } else if (state.filter === 'completed') {
      DOM.emptyStateTitle.textContent = 'No completed tasks yet';
      DOM.emptyStateMessage.textContent = 'Finish some of your tasks and mark them done to see them here!';
    } else if (state.filter === 'active') {
      DOM.emptyStateTitle.textContent = 'All caught up!';
      DOM.emptyStateMessage.textContent = 'There are no active pending tasks in your list. Relax or add a new goal.';
    } else {
      DOM.emptyStateTitle.textContent = 'Your to-do list is empty';
      DOM.emptyStateMessage.textContent = 'Start by creating your first task using the input box above.';
    }
  } else {
    DOM.emptyState.hidden = true;
    const fragment = document.createDocumentFragment();

    filteredTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      fragment.appendChild(taskElement);
    });

    DOM.taskList.appendChild(fragment);
  }
}

/**
 * Builds a single task `<li>` DOM node with delegated action triggers.
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.dataset.id = task.id;

  // Check if this task is currently being edited inline
  if (state.editingTaskId === task.id) {
    li.classList.add('is-editing');
    li.innerHTML = `
      <form class="edit-task-form" data-action="save-edit">
        <input 
          type="text" 
          class="edit-task-input" 
          value="${escapeHTML(task.title)}" 
          maxlength="140"
          required
          aria-label="Editing task: ${escapeHTML(task.title)}"
        />
        <div class="edit-task-actions">
          <button type="button" class="btn btn-small btn-secondary" data-action="cancel-edit">Cancel</button>
          <button type="submit" class="btn btn-small btn-primary">Save Changes</button>
        </div>
      </form>
    `;

    // Automatically focus the input after rendering
    setTimeout(() => {
      const input = li.querySelector('.edit-task-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);

    return li;
  }

  // Normal display mode
  const dueDateInfo = formatDueDate(task.dueDate);

  li.innerHTML = `
    <!-- Checkbox Toggle -->
    <label class="task-checkbox-wrap" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
      <input 
        type="checkbox" 
        class="task-checkbox-input" 
        data-action="toggle-complete" 
        ${task.completed ? 'checked' : ''}
        aria-label="Toggle completion of ${escapeHTML(task.title)}"
      />
      <div class="task-checkbox-custom">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    </label>

    <!-- Main Content -->
    <div class="task-main-content">
      <span class="task-title" title="Double click or click edit icon to modify">${escapeHTML(task.title)}</span>
      
      <div class="task-meta-row">
        <!-- Priority Badge (priority normalized to high|medium|low) -->
        <span class="badge badge-priority-${escapeHTML(task.priority)}">
          ● ${escapeHTML(task.priority.charAt(0).toUpperCase() + task.priority.slice(1))}
        </span>

        <!-- Category Badge -->
        <span class="badge badge-category">
          ${escapeHTML(task.category)}
        </span>

        <!-- Optional Due Date Badge -->
        ${dueDateInfo ? `
          <span class="badge badge-due ${dueDateInfo.className}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${dueDateInfo.text}
          </span>
        ` : ''}
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="task-actions">
      <button class="action-btn edit-btn" data-action="start-edit" title="Edit task" aria-label="Edit task: ${escapeHTML(task.title)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      <button class="action-btn delete-btn" data-action="delete-task" title="Delete task" aria-label="Delete task: ${escapeHTML(task.title)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  `;

  return li;
}

// =============================================================================
// Event Handlers & Delegation
// =============================================================================

/**
 * Returns keyboard focus to a task's edit button after inline editing ends,
 * so keyboard users are not dropped back to the top of the document.
 */
function focusTaskEditButton(taskId) {
  const buttons = DOM.taskList.querySelectorAll('.edit-btn');
  for (const btn of buttons) {
    const item = btn.closest('.task-item');
    if (item && item.dataset.id === taskId) {
      btn.focus();
      return;
    }
  }
}

function setupEventListeners() {
  // 1. Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // 2. Add Task Form Submission (CREATE)
  DOM.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = DOM.taskTitleInput.value;
    const priority = DOM.taskPrioritySelect.value;
    const category = DOM.taskCategorySelect.value;
    const dueDate = DOM.taskDueDateInput.value;

    const success = addTask(title, priority, category, dueDate);
    if (success) {
      DOM.taskTitleInput.value = '';
      DOM.taskDueDateInput.value = '';
      DOM.taskTitleInput.focus();
    }
  });

  // 3. EVENT DELEGATION on Task List Container (READ / UPDATE / DELETE)
  DOM.taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    const taskId = taskItem.dataset.id;

    // Check action triggered
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

  // Handle Double-Click on task title to edit
  DOM.taskList.addEventListener('dblclick', (e) => {
    const taskTitle = e.target.closest('.task-title');
    if (taskTitle) {
      const taskItem = e.target.closest('.task-item');
      if (taskItem) {
        state.editingTaskId = taskItem.dataset.id;
        renderApp();
      }
    }
  });

  // Checkbox toggle (Change Event via Delegation)
  DOM.taskList.addEventListener('change', (e) => {
    if (e.target.dataset.action === 'toggle-complete') {
      const taskItem = e.target.closest('.task-item');
      if (taskItem) {
        toggleTaskCompletion(taskItem.dataset.id);
      }
    }
  });

  // Inline Edit Form Submission (Submit Event via Delegation)
  DOM.taskList.addEventListener('submit', (e) => {
    if (e.target.dataset.action === 'save-edit') {
      e.preventDefault();
      const taskItem = e.target.closest('.task-item');
      const input = e.target.querySelector('.edit-task-input');
      if (taskItem && input) {
        const taskId = taskItem.dataset.id;
        if (updateTaskTitle(taskId, input.value)) {
          focusTaskEditButton(taskId);
        }
        // On validation failure the edit form stays open with focus intact
      }
    }
  });

  // Keyboard shortcut during inline editing: Escape cancels
  DOM.taskList.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.editingTaskId) {
      const taskId = state.editingTaskId;
      state.editingTaskId = null;
      renderApp();
      focusTaskEditButton(taskId);
    }
  });

  // 4. Status Filter Tabs (renderApp syncs .active + aria-pressed)
  DOM.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (state.filter === tab.dataset.filter) return;
      state.filter = tab.dataset.filter;
      // Rebuilding the list would silently discard unsaved edit keystrokes
      state.editingTaskId = null;
      renderApp();
    });
  });

  // 5. Priority Filter & Sort Dropdowns
  DOM.filterPrioritySelect.addEventListener('change', (e) => {
    state.priorityFilter = e.target.value;
    state.editingTaskId = null;
    renderApp();
  });

  DOM.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.editingTaskId = null;
    renderApp();
  });

  // 6. Search Input Handling
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    state.editingTaskId = null;
    DOM.clearSearchBtn.hidden = state.searchQuery.length === 0;
    renderApp();
  });

  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    state.editingTaskId = null;
    DOM.clearSearchBtn.hidden = true;
    renderApp();
    DOM.searchInput.focus();
  });

  // 7. Bulk Action Buttons
  DOM.markAllCompleteBtn.addEventListener('click', markAllComplete);
  DOM.clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  // 8. Data Import / Export / Reset
  DOM.exportDataBtn.addEventListener('click', exportTasksToJSON);
  DOM.importFileInput.addEventListener('change', handleImportFile);
  DOM.resetDemoBtn.addEventListener('click', () => {
    if (confirm('Load sample demo tasks? This will replace current tasks.')) {
      state.tasks = cloneDefaultTasks();
      state.editingTaskId = null;
      saveStateToStorage();
      renderApp();
      showToast('Demo tasks loaded successfully', 'success');
    }
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Press '/' outside of any editable field to focus search
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;

    const active = document.activeElement;
    const isEditable = !!active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'SELECT' ||
      active.isContentEditable
    );
    if (isEditable) return;

    e.preventDefault();
    DOM.searchInput.focus();
  });
}

// =============================================================================
// Export & Import Tools
// =============================================================================

function exportTasksToJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `taskmaster_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Exported tasks to JSON', 'success');
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!Array.isArray(parsed)) {
        showToast('Invalid backup file structure', 'danger');
        return;
      }

      const sanitized = sanitizeTasks(parsed);
      if (sanitized.length === 0 && parsed.length > 0) {
        showToast('Invalid backup file structure', 'danger');
        return;
      }

      state.tasks = sanitized;
      state.editingTaskId = null;
      saveStateToStorage();
      renderApp();
      showToast(`Imported ${sanitized.length} tasks successfully`, 'success');
    } catch (err) {
      console.error('Failed to import tasks:', err);
      showToast('Error reading JSON file', 'danger');
    }
  };
  reader.onerror = () => {
    showToast('Error reading JSON file', 'danger');
  };
  reader.readAsText(file);
  // Reset input value so subsequent imports of same file re-trigger
  e.target.value = '';
}

// =============================================================================
// Initialization
// =============================================================================

function updateDateHeader() {
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  DOM.currentDateDisplay.textContent = now.toLocaleDateString(undefined, options);
}

function init() {
  updateDateHeader();
  loadStateFromStorage();
  setupEventListeners();
  renderApp();
}

// Run upon DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
