export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const login = (token, userData) => {
  localStorage.setItem('token', token);
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const handleAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    const userData = {
      id: urlParams.get('id'),
      name: urlParams.get('name'),
      email: urlParams.get('email'),
      avatar: urlParams.get('avatar')
    };
    
    login(token, userData);
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  
  return false;
};