import React, { useState } from "react";

export default function Dashboard({ onLogout }) {
  const [showPatches, setShowPatches] = useState(false);

  // Sample patches data
  const patches = [
    "Patch 1",
    "Patch 2",
    "Patch 3",
    "Patch 4",
    "Patch 5"
  ];

  return (
    <div className="d-flex">
      {/* Side navigation */}
      <div className="bg-dark text-white" style={{ width: "250px", height: "100vh", padding: "1rem" }}>
        <h4>Software releases</h4>
        <div className="list-group">
          {/* Dropdown for Patches */}
          <button
            className="list-group-item list-group-item-action text-white bg-dark"
            onClick={() => setShowPatches(!showPatches)}
            aria-expanded={showPatches}
          >
            <i className="bi bi-patch-check"></i> Patches
          </button>
          {showPatches && (
            <div className="list-group mt-2">
              {patches.map((patch, index) => (
                <button key={index} className="list-group-item list-group-item-action text-white bg-secondary">
                  {patch}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Logout Button */}
        <button className="btn btn-danger mt-4 w-100" onClick={onLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h2>Main Content</h2>
        <p>
          This is the main content area.
        </p>
      </div>
    </div>
  );
}
