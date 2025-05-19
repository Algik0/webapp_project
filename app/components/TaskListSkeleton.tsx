import React from "react";
import "../styles/tasks.css";

export default function TaskListSkeleton() {
  return (
    <div className="task-container">
      <div className="task-header">
        <div className="task-title skeleton-box" style={{ width: 120, height: 28 }} />
      </div>
      <ul className="task-list">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="task-list-item">
            <span className="task-list-name skeleton-box" style={{ width: 120, height: 18 }} />
            <div className="task-actions">
              <span className="task-important-icon skeleton-box" style={{ width: 18, height: 18 }} />
              <span className="task-delete-icon skeleton-box" style={{ width: 18, height: 18 }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
