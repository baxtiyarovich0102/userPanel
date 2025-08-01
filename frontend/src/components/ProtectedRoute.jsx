import { useEffect, useState } from 'react';
import API from '../services/api';

export default function ProtectedRoute({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    API.get('/users')
      .then(() => setReady(true))
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);
  if (!ready) return <div className="p-5">Loading...</div>;
  return children;
}
