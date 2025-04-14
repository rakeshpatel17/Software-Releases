import React, { useState } from "react";

export default function Dashboard({ onLogout }) {
  const [showPatches, setShowPatches] = useState(false);

  const [patches, setPatches] = useState([
    "Patch 1",
    "Patch 2",
    "Patch 3",
    "Patch 4",
    "Patch 5",
  ]);

  // State to store the patch that the user clicked
  const [selectedPatch, setSelectedPatch] = useState(null);

  // Sample data for each patch – later you can fetch these from your backend
  const [sampleData, setSampleData] = useState({
    "Patch 1": [
      { product: "Product A1", image: "https://via.placeholder.com/100" },
      { product: "Product A2", image: "https://via.placeholder.com/100" }
    ],
    "Patch 2": [
      { product: "Product B1", image: "https://via.placeholder.com/100" },
      { product: "Product B2", image: "https://via.placeholder.com/100" }
    ],
    "Patch 3": [
      { product: "Product C1", image: "https://via.placeholder.com/100" },
      { product: "Product C2", image: "https://via.placeholder.com/100" }
    ],
    "Patch 4": [
      { product: "Product D1", image: "https://via.placeholder.com/100" },
      { product: "Product D2", image: "https://via.placeholder.com/100" }
    ],
    "Patch 5": [
      { product: "Product E1", image: "https://via.placeholder.com/100" },
      { product: "Product E2", image: "https://via.placeholder.com/100" }
    ]
  });

  // Function to add a new patch to the list
  const addPatch = () => {
    // For example, using a simple prompt (you may later replace it with a proper form/modal)
    const newPatch = window.prompt("Enter new patch name:");
    if (newPatch && newPatch.trim() !== "") {
      const patchName = newPatch.trim();
      if (patches.includes(patchName)) {
        alert("Patch already exists.");
        return;
      }
      // Add the new patch to the patches state
      setPatches([...patches, newPatch.trim()]);
      // Optionally, you may want to set up default sample data for a new patch.
      setSampleData({...sampleData, [patchName]: [{ product: "New Product", image: "https://via.placeholder.com/100" }]})
    }
  };

  // Function to delete the selected patch
  const handleDeletePatch = () => {
    if (!selectedPatch) return;
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete ${selectedPatch}?`))
      return;
    // Remove from patches list
    setPatches((prevPatches) =>
      prevPatches.filter((patch) => patch !== selectedPatch)
    );
    // Remove the patch data
    setSampleData((prevData) => {
      const newData = { ...prevData };
      delete newData[selectedPatch];
      return newData;
    });
    // Clear selection if the deleted patch was selected
    setSelectedPatch(null);
  };

  // Function to add a new product to the selected patch
  const handleAddProduct = () => {
    if (!selectedPatch) return;
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
    if (images.length === 0) {
      // images.push("https://via.placeholder.com/100");
    }
    // Create a new product record with an array of images
    const newProduct = { product: prodName.trim(), images };
    // Append the new product to the selected patch's data
    setSampleData((prevData) => {
      const currentRecords = prevData[selectedPatch] || [];
      return { ...prevData, [selectedPatch]: [...currentRecords, newProduct] };
    });
  };

  // Function to handle a patch click – setting the selected patch.
  const handlePatchClick = (patchName) => {
    setSelectedPatch(patchName);
  };

  // Render the patch-specific table in the main content area.
  const renderPatchTable = () => {
    if (!selectedPatch) {
      return <div>Please select a patch to view details.</div>;
    }
    const patchRecords = sampleData[selectedPatch] || [];
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
          {patchRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.product}</td>
              <td>
                {record.images ? (
                  record.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      //alt={`${record.product} ${idx}`}
                      alt={`${imgUrl}`}
                      width="100"
                      style={{ marginRight: "5px" }}
                    />
                  ))
                ) : record.image ? (
                  <img src={record.image} alt={record.product} width="100" />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Buttons to delete the patch and add a new product */}
      <div className="mt-3">
          <button className="btn btn-danger me-2" onClick={handleDeletePatch}>
            Delete Patch
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
                <button key={index} className="list-group-item list-group-item-action text-white bg-secondary"
                onClick={() => handlePatchClick(patch)}>
                  {patch}
                </button>
              ))}
              {/* Add Patch Button */}
              <button
                className="btn btn-success mt-3 w-100"
                onClick={addPatch}
              >
                Add Patch
              </button>
            </div>
          )}
        </div>
        {/* Logout Button */}
        <button className="btn btn-danger mt-4 w-100" onClick={onLogout}>Logout</button>
      </div>

      {/* Main Content: Display table for the selected patch */}
      <div className="flex-grow-1 p-4">
        <h2>Patch Details: {selectedPatch || "None Selected"}</h2>
        {renderPatchTable()}
      </div>
    </div>
  );
}
