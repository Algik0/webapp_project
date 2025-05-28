// TaskListSkeleton: Platzhalter/Skeleton für die Aufgabenliste
// Wird angezeigt, solange Tasks geladen werden
import React from "react";
import "../styles/tasks.css";

export default function TaskListSkeleton() {
  return (
    <div className="shared-container">
      <div className="shared-header">
        <div
          className="shared-title skeleton-box"
          style={{ width: 120, height: 28 }}
        />
      </div>
      <ul className="shared-list">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="shared-list-item">
            <span
              className="shared-list-name skeleton-box"
              style={{ width: 120, height: 18 }}
            />
            <div className="shared-actions">
              <span
                className="shared-important-icon skeleton-box"
                style={{ width: 18, height: 18 }}
              />
              <span
                className="shared-delete-icon skeleton-box"
                style={{ width: 18, height: 18 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
