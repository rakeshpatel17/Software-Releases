import React, { useState } from "react";
import ArrayFetch from "./ArrayFetch";

export default function Dashboard({ onLogout }) {
  
  // Using the reusable hook to fetch data from your API endpoint
  const {data : releases, loading, error, setData : setReleases } = ArrayFetch("http://localhost:4000/api/releases");
  
  const [showReleases, setShowReleases] = useState(false);
  // State to store the release that the user clicked
  const [selectedRelease, setSelectedRelease] = useState(null);

  // Sample data for each release – later you can fetch these from your backend
  const [sampleData, setSampleData] = useState({
    "Release 1": [
      { product: "Product A1", image: "https://via.placeholder.com/100" },
      { product: "Product A2", image: "https://via.placeholder.com/100" }
    ],
    "Release 2": [
      { product: "Product B1", image: "https://via.placeholder.com/100" },
      { product: "Product B2", image: "https://via.placeholder.com/100" }
    ],
    "Release 3": [
      { product: "Product C1", image: "https://via.placeholder.com/100" },
      { product: "Product C2", image: "https://via.placeholder.com/100" }
    ],
    "Release 4": [
      { product: "Product D1", image: "https://via.placeholder.com/100" },
      { product: "Product D2", image: "https://via.placeholder.com/100" }
    ],
    "Release 5": [
      { product: "Product E1", image: "https://via.placeholder.com/100" },
      { product: "Product E2", image: "https://via.placeholder.com/100" }
    ]
  });

  // Function to add a new release to the list
  const addRelease = () => {
    // For example, using a simple prompt (you may later replace it with a proper form/modal)
    const newRelease = window.prompt("Enter new release name:");
    if (newRelease && newRelease.trim() !== "") {
      const releaseName = newRelease.trim();
      if (releases.includes(releaseName)) {
        alert("Release already exists.");
        return;
      }
      // Add the new release to the releases state
      setReleases([...releases, releaseName]);
      // Optionally, set up default sample data for the new release.
      setSampleData({
        ...sampleData,
        [releaseName]: [
          { product: "New Product", image: "https://via.placeholder.com/100" }
        ],
      });
    }
  };

  // Function to delete the selected release
  const handleDeleteRelease = () => {
    if (!selectedRelease) return;
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete ${selectedRelease}?`))
      return;
    // Remove from releases list
    setReleases((prevReleases) =>
      prevReleases.filter((release) => release !== selectedRelease)
    );
    // Remove the release data
    setSampleData((prevData) => {
      const newData = { ...prevData };
      delete newData[selectedRelease];
      return newData;
    });
    // Clear selection if the deleted release was selected
    setSelectedRelease(null);
  };

  // Function to add a new product to the selected release
  const handleAddProduct = () => {
    if (!selectedRelease) return;
    const prodName = window.prompt("Enter product name:");
    if (!prodName || prodName.trim() === "") return;
    const imageStr = window.prompt(
      "Enter image URLs separated by commas (leave empty for a placeholder):"
    );
    let images = [];
    if (imageStr && imageStr.trim() !== "") {
      images = imageStr
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }
    // Create a new product record with an array of images
    const newProduct = { product: prodName.trim(), images };
    // Append the new product to the selected release's data
    setSampleData((prevData) => {
      const currentRecords = prevData[selectedRelease] || [];
      return { ...prevData, [selectedRelease]: [...currentRecords, newProduct] };
    });
  };

  // Function to handle a release click – setting the selected release.
  const handleReleaseClick = (releaseName) => {
    setSelectedRelease(releaseName);
  };

  // Render the release-specific table in the main content area.
  const renderReleaseTable = () => {
    if (!selectedRelease) {
      return <div>Please select a release to view details.</div>;
    }
    const releaseRecords = sampleData[selectedRelease] || [];
    return (
      <>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Product</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {releaseRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.product}</td>
                <td>
                  {record.images ? (
                    record.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={imgUrl}
                        width="100"
                        style={{ marginRight: "5px" }}
                      />
                    ))
                  ) : record.image ? (
                    <img
                      src={record.image}
                      alt={record.product}
                      width="100"
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Buttons to delete the release and add a new product */}
        <div className="mt-3">
          <button className="btn btn-danger me-2" onClick={handleDeleteRelease}>
            Delete Release
          </button>
          <button className="btn btn-primary" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="d-flex">
      {/* Side navigation */}
      <div className="bg-dark text-white" style={{ width: "250px", height: "100vh", padding: "1rem" }}>
        <h4>OpenText</h4>
        <div className="list-group">
          {/* Dropdown for Releases */}
          <button
            className="list-group-item list-group-item-action text-white bg-dark"
            onClick={() => setShowReleases(!showReleases)}
            aria-expanded={showReleases}
          >
            <i className="bi bi-patch-check"></i> Releases
          </button>
          {showReleases && (
            <div className="list-group mt-2">
              {loading ? (
                <div className="list-group-item text-white bg-secondary">
                  Loading...
                </div>
              ) : error ? (
                <div className="list-group-item text-white bg-secondary">
                  Error loading releases.
                </div>
              ) : (
                releases.map((release, index) => (
                  <button
                    key={index}
                    className="list-group-item list-group-item-action text-white bg-secondary"
                    onClick={() => handleReleaseClick(release)}
                  >
                    {release}
                  </button>
                ))
              )}
              {/* Add Release Button */}
              <button className="btn btn-success mt-3 w-100" onClick={addRelease}>
                Add Release
              </button>
            </div>
          )}
        </div>
        {/* Logout Button */}
        <button className="btn btn-danger mt-4 w-100" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Main Content: Display table for the selected release */}
      <div className="flex-grow-1 p-4">
        <h2>Release Details: {selectedRelease || "None Selected"}</h2>
        {renderReleaseTable()}
      </div>
    </div>
  );
}