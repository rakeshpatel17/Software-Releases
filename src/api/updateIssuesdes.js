export const securityIssuesUpdate = async (patchName, payload) => {
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  console.log("payload : ",payload);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
  };

  const fullUrl = `${base_url}/patches/${patchName}/`;

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update security issue');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Update successful' };
};
