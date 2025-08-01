import { useState } from 'react';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/users';
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <form onSubmit={handle}>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
        <div className="mt-2">
          <small>
            Don't have account? <a href="/register">Register</a>
          </small>
        </div>
      </form>
    </div>
  );
}
