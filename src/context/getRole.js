import { jwtDecode } from 'jwt-decode';

export function getRole() {
  const authTokens = localStorage.getItem('authTokens');
  
  if (!authTokens) return null;

  try {
    const parsedTokens = JSON.parse(authTokens);
    const decoded = jwtDecode(parsedTokens.access);
    return decoded.role || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}