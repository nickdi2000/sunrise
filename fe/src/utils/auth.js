// Check if user is authenticated by verifying JWT token exists
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
}

// Login user and store JWT token
export const login = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
}

// Logout user and remove JWT token
export const logout = () => {
  localStorage.removeItem('token');
}

// Get the JWT token
export const getToken = () => {
  return localStorage.getItem('token');
}
