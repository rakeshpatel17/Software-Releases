export const securityIssuesUpdate = async (patchName, data) => {
  console.log("Security issues data to send:", data);
    console.log("patchname", patchName);

  const base_url = process.env.REACT_APP_BACKEND_URL;
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
  };

 const fullUrl = `${base_url}/patches/${patchName}/`;
  console.log("Final PATCH URL:", fullUrl);

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update security issues');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { message: 'Security issues updated successfully' };
};
