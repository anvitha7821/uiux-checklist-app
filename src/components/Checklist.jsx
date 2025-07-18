// src/components/Checklist.jsx
import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import data from "../data/checklist.json";
import html2pdf from "html2pdf.js";

function Checklist() {
  // Load from LocalStorage or JSON
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("uiux-checklist");
    return saved ? JSON.parse(saved) : data;
  });
  const [darkMode, setDarkMode] = useState(false);

  // Persist on every tasks change
  useEffect(() => {
    localStorage.setItem("uiux-checklist", JSON.stringify(tasks));
  }, [tasks]);

  // Handlers
  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const resetChecklist = () => {
    setTasks(tasks.map((t) => ({ ...t, done: false })));
  };

  const exportToPDF = () => {
    const element = document.getElementById("checklist-content");
    html2pdf().from(element).save("checklist.pdf");
  };

  // Add a new task
  const [newCategory, setNewCategory] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newTaskText.trim()) return;
    setTasks([
      ...tasks,
      { category: newCategory.trim(), task: newTaskText.trim(), done: false },
    ]);
    setNewCategory("");
    setNewTaskText("");
  };

  // Group by category
  const grouped = tasks.reduce((acc, task, i) => {
    (acc[task.category] = acc[task.category] || []).push({ ...task, index: i });
    return acc;
  }, {});

  // Progress
  const completed = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen p-6`}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">UI/UX Checklist ✅</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={resetChecklist}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reset All
          </button>
          <button
            onClick={exportToPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-4"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-center mt-1">{percent}% completed</p>
        </div>

        {/* Add-Task Form */}
        <form
          onSubmit={handleAddTask}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-3"
        >
          <h2 className="text-lg font-semibold">➕ Add New Task</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Task description"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-2 p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        </form>

        {/* Checklist Items */}
        <div id="checklist-content" className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                {category}
              </h2>
              <div className="space-y-2">
                {items.map(({ index, ...task }) => (
                  <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Checklist;
