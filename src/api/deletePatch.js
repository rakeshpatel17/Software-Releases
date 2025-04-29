export const deletePatch = async (patchName) => {
    const response = await fetch(`http://127.0.0.1:8000/patches?name=${encodeURIComponent(patchName)}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete patch');
    }
  
    return response.json();
  };