
import axios from 'axios';

const get_products = async () => {
  try {
    // const response = await fetch("/product.json", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //     // No Authorization needed for local file
    //   }
    // });

    // if (!response.ok) throw new Error("Failed to fetch product.json");

    // const data = await response.json();
    // return data;
     const response = await axios.get("/product.json", {
      // headers: {
      //   "Content-Type": "application/json"
      //   // No Authorization needed for local file
      // }
    });

    // On success, axios provides the parsed data in `response.data`.
    return response.data;
  } catch (error) {
    console.error("Error in get_products:", error);
    return null;
  }
};

export default get_products;
