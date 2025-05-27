const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const authHeader = 'Basic ' + btoa(`${username}:${password}`);

const common_headers = {
  "Content-Type": "application/json",
  'Authorization': authHeader,
  // Add Authorization or other headers if needed

};

export const deletePatch = async (patchName) => {
  const base_url = process.env.REACT_APP_BACKEND_URL; // Backend URL
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  const common_headers = {
    "Content-Type": "application/json",
    'Authorization': authHeader
  };
  // const response = await fetch(`${base_url}/patches/${patchName}/`, {
  const response = await fetch(`${base_url}/patches/${encodeURIComponent(patchName)}/`, {
    method: 'DELETE',
    headers: {
      ...common_headers,
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete patch');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Patch deleted successfully' };

  // return response.json();
};