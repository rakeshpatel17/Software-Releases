const base_url = "http://127.0.0.1:8000"; // Backend URL

const common_headers = {
  "Content-Type": "application/json",
  // Add Authorization or other headers if needed
};

// const get_user = async () => {
  
// };

const get_release = async () => {
  try {
    const response = await fetch(`${base_url}/releases`, {
      method: "GET",
      headers: common_headers,
    });

    if (!response.ok) throw new Error("Failed to fetch releases");

    const data = await response.json();
    console.log("Release Data:", data);
    return data;
  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_release;