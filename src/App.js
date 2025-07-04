import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, User, LogOut, Search, Filter } from 'lucide-react';
import './App.css';

//local storage
const getStoredTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const getStoredUser = () => {
  return localStorage.getItem('currentUser');
};

const storeTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const storeUser = (username) => {
  localStorage.setItem('currentUser', username);
};

const clearUser = () => {
  localStorage.removeItem('currentUser');
};

// Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      storeUser(username);
      onLogin(username);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <User size={32} />                  
          </div>
          <h1 className="login-title">Focus it!</h1>
          <p className="login-subtitle">Enter your username to continue</p>
        </div>
        
        <div className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              placeholder="Enter your username"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            className="btn btn-primary btn-full"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Task Form Component
const TaskForm = ({ onAddTask, onCancel, editingTask, onUpdateTask }) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');

  const handleSubmit = () => {
    if (title.trim()) {
      if (editingTask) {
        onUpdateTask(editingTask.id, { title, description });
      } else {
        onAddTask({ title, description });
      }
      setTitle('');
      setDescription('');
      if (onCancel) onCancel();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="task-form-container">
      <h3 className="task-form-title">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h3>
      
      <div className="task-form-fields">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
            placeholder="Enter task title"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            placeholder="Enter task description (optional)"
          />
        </div>
        
        <div className="form-buttons">
          <button
            onClick={handleSubmit}
            className="btn btn-primary btn-flex"
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="btn btn-secondary btn-flex"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          >
            {task.completed && <Check size={16} />}
          </button>
          <h3 className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
            {task.title}
          </h3>
        </div>
        
        {task.description && (
          <p className={`task-description ${task.completed ? 'muted' : ''}`}>
            {task.description}
          </p>
        )}
        
        <p className="task-date">
          Created: {formatDate(task.createdAt)}
        </p>
      </div>
      
      <div className="task-actions">
        <button
          onClick={() => onEditTask(task)}
          className="btn-icon btn-edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="btn-icon btn-delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p className="delete-message">
            Are you sure you want to delete this task?
          </p>
          <div className="delete-actions">
            <button
              onClick={handleConfirmDelete}
              className="btn btn-danger btn-small"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn btn-secondary btn-small"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Task Filter Component
const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed }
  ];

  return (
    <div className="filter-container">
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>
    </div>
  );
};

// Search Component
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="search-input"
        />
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      setTasks(getStoredTasks());
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      storeTasks(tasks);
    }
  }, [tasks, currentUser]);

  const handleLogin = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    clearUser();
    setCurrentUser(null);
    setTasks([]);
  };

  const handleAddTask = ({ title, description }) => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setShowAddForm(false);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddForm(true);
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'completed') return task.completed && matchesSearch;
    if (filter === 'pending') return !task.completed && matchesSearch;
    return matchesSearch;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <User size={24} />
            </div>
            <div className="header-text">
              <h1 className="header-title">Focus it!</h1>
              <p className="header-subtitle">Hello, {currentUser}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary header-logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-header">
          <h2 className="main-title">My Tasks</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary add-task-btn"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        {showAddForm && (
          <TaskForm
            onAddTask={handleAddTask}
            onCancel={handleCancelEdit}
            editingTask={editingTask}
            onUpdateTask={handleUpdateTask}
          />
        )}

        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Filter size={48} />
              </div>
              <h3 className="empty-title">No tasks found</h3>
              <p className="empty-subtitle">
                {searchTerm ? 'Try adjusting your search term' : 'Create your first task to get started!'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;