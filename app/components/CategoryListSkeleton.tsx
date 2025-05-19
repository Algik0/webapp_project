import React from "react";
import "../styles/category.css";

export default function CategoryListSkeleton() {
  return (
    <div className="category-container">
      <div className="category-header">
        <div className="category-title skeleton-box" style={{ width: 140, height: 28 }} />
      </div>
      <div className="category-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="category-list-item">
            <span className="category-list-name skeleton-box" style={{ width: 100, height: 18 }} />
            <span className="category-delete-icon skeleton-box" style={{ width: 18, height: 18 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
