const base_url = "http://127.0.0.1:8000"; // Backend URL

const common_headers = {
  "Content-Type": "application/json",
  // Add Authorization or other headers if needed
};

const get_patches = async (releaseId) => {
  try {
    const endpoint = `${base_url}/patches`; //endpoint for displaying all patches

    const response = await fetch(endpoint, {
      method: "GET",
      headers: common_headers,
    });

    if (!response.ok) throw new Error("Failed to fetch patches");

    const data = await response.json();

    // Filter if releaseId is provided
    const filteredData = releaseId !== 'releases'
      ? data.filter((patch) => patch.release === (releaseId))
      : data;

    console.log("filtered Patch Data:", filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error in get_patches:", error);
    return null;
  }
};

export default get_patches;
