// src/components/TaskItem.jsx
import React from "react";
import { CheckCircle, Circle, Trash2 } from "lucide-react";

function TaskItem({ task, index, toggleTask, deleteTask }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded transition ${
        task.done ? "bg-green-100 text-green-700" : "bg-gray-100"
      } mb-2`}>
      <div className="flex items-center gap-3">
        <button onClick={() => toggleTask(index)} className="focus:outline-none">
          {task.done ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <Circle className="text-gray-400" />
          )}
        </button>
        <span className={task.done ? "line-through" : ""}>{task.task}</span>
      </div>
      <button onClick={() => deleteTask(index)} className="focus:outline-none">
        <Trash2 className="text-red-500 hover:text-red-700" />
      </button>
    </div>
  );
}

export default TaskItem;
