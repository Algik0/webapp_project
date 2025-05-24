// CategoryListSkeleton: Platzhalter/Skeleton für die Kategorieliste
// Wird angezeigt, solange Kategorien geladen werden
import React from "react";

export default function CategoryListSkeleton() {
  return (
    <div className="shared-container">
      <div className="shared-header">
        <div
          className="shared-title skeleton-box"
          style={{ width: 140, height: 28 }}
        />
      </div>
      <div className="shared-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shared-list-item">
            <span
              className="shared-list-name skeleton-box"
              style={{ width: 100, height: 18 }}
            />
            <span
              className="shared-delete-icon skeleton-box"
              style={{ width: 18, height: 18 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
