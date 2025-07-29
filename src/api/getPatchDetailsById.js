const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL

const getPatchDetailsById = async (patchName) => {
  try {
    const endpoint = `${base_url}/patches/${patchName}/details`; // Endpoint to fetch all patches

    
    const response = await axios.get(endpoint);

    // On success, axios provides the parsed data in `response.data`.
    const data = response.data;

    if (Array.isArray(data)) {
      return data[0] || null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPatchesById:", error);
    return null;
  }
};

export { getPatchDetailsById };
