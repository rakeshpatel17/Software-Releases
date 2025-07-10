
const base_url     = process.env.REACT_APP_BACKEND_URL;
const username     = process.env.REACT_APP_USERNAME;
const password     = process.env.REACT_APP_PASSWORD;
const authHeader   = 'Basic ' + btoa(`${username}:${password}`);
const common_headers = {
  'Content-Type':  'application/json',
  'Authorization': authHeader,
};

const hydrateImages = async (images) => {
    console.log("images sednding are  : ", images);
  try {
    const res = await fetch(`${base_url}/images/hydrate/`, {
      method:  'POST',
      headers: { ...common_headers },
      body:    JSON.stringify(images),
    });
    if (!res.ok) throw new Error(`Hydrate failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error in hydrateImages:', err);
    return [];
  }
};

export default hydrateImages;
