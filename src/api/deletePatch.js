export const deletePatch = async (patchName) => {
  const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  const common_headers = {
    "Content-Type": "application/json",
    'Authorization': authHeader
  };
    const response = await fetch(`${base_url}/patches?name=${encodeURIComponent(patchName)}`, {
      method: 'DELETE',
      headers: {
            common_headers,
      }
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete patch');
    }
  
    return response.json();
  };