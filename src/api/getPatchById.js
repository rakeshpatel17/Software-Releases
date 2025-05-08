const base_url = "http://127.0.0.1:8000"; // Backend URL
const common_headers = {
    "Content-Type": "application/json",
    // Add Authorization or other headers if needed
};
const getPatchById = async (patchName) => {
    try {
      const endpoint = `${base_url}/patches`; // Endpoint to fetch all patches
  
      const response = await fetch(endpoint, {
        method: "GET",
        headers: common_headers,
      });
  
      if (!response.ok) throw new Error("Failed to fetch patches");
  
      const data = await response.json();
  
      // Filter by patch name (case-insensitive match if needed)
      const filteredData = data.filter(
        patch => patch.name && patch.name.toLowerCase() === patchName.toLowerCase()
      );
  
      // console.log("Filtered Patch by Name:", filteredData);
      return filteredData;
    } catch (error) {
      console.error("Error in getPatchesById:", error);
      return null;
    }
  };
  
  export {getPatchById};
  