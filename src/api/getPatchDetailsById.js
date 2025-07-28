const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader
};
const getPatchDetailsById = async (patchName) => {
  try {
    const endpoint = `${base_url}/patches/${patchName}/details`; // Endpoint to fetch all patches

    // const response = await fetch(endpoint, {
    //   method: "GET",
    //   headers: {
    //     ...common_headers,
    //   }
    // });

    // if (!response.ok) throw new Error("Failed to fetch patches");

    // const data = await response.json();
    const response = await axios.get(endpoint, {
      headers: common_headers,
    });

    // On success, axios provides the parsed data in `response.data`.
    const data = response.data;

    if (Array.isArray(data)) {
      return data[0] || null;
    }
    // Filter by patch name (case-insensitive match if needed)
    // const filteredData = data.filter(
    //   patch => patch.name && patch.name.toLowerCase() === patchName.toLowerCase()
    // );

    // console.log("Filtered Patch by Name:", filteredData);
    // return filteredData;
    return data;
  } catch (error) {
    console.error("Error in getPatchesById:", error);
    return null;
  }
};

export { getPatchDetailsById };
