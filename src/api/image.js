const base_url = "http://127.0.0.1:8000"; // Backend URL

const common_headers = {
  "Content-Type": "application/json",
  // Add Authorization or other headers if needed
};

const getProductDetails = async (productId) => {
  try {
    const endpoint = `${base_url}/${productId}/`; // backend expects trailing slash

    const response = await fetch(endpoint, {
      method: "GET",
      headers: common_headers,
    });

    if (!response.ok) throw new Error("Failed to fetch product details");

    const data = await response.json();
    console.log("Fetched product details with images:", data.images);

    // Ensure 'images' field is available
    return data;
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    return null;
  }
};

export default getProductDetails;
