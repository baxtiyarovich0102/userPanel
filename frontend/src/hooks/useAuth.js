import { useState, useEffect } from 'react';

function parseJwt(token) {
  try {
    const base = token.split('.')[1];
    const json = decodeURIComponent(
      atob(base)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload?.userId) {
        setUser({ id: payload.userId });
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };
  return { user, logout };
}
