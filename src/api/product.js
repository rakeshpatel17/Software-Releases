// const base_url = process.env.REACT_APP_BACKEND_URL;; // Backend URL
// const username = process.env.REACT_APP_USERNAME;
// const password = process.env.REACT_APP_PASSWORD;
// const authHeader = 'Basic ' + btoa(`${username}:${password}`);
// const common_headers = {
//   "Content-Type": "application/json",
//   'Authorization': authHeader
// };

// const get_release = async () => {
//   try {
//     const response = await fetch(`${base_url}/products`, {
//       method: "GET",
//       headers: {
//             ...common_headers,
//       }
//     });

//     if (!response.ok) throw new Error("Failed to fetch releases");

//     const data = await response.json();
//     // console.log("product Data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error in get_release:", error);
//     return null;
//   }
// };

// export default get_release;

const get_release = async () => {
  try {
    const response = await fetch("/product.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
        // No Authorization needed for local file
      }
    });

    if (!response.ok) throw new Error("Failed to fetch product.json");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in get_release:", error);
    return null;
  }
};

export default get_release;
