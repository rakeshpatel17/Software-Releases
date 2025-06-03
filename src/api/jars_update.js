export const jarsUpdate = async (id, data) => {
  console.log("data getting to send : ", data);
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);

  const common_headers = {
    "Content-Type": "application/json",
    'Authorization': authHeader
  };

  const response = await fetch(`${base_url}/patches/${id}/`, {
    method: 'PATCH',
    headers: common_headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update patch-jar entry');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Patch-jar updated successfully' };
};