import { useState } from 'react';
import API from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    try {
      await API.post('/register', { name, email, password });
      window.location.href = '/login';
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Register</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <form onSubmit={handle}>
        <div className="mb-2">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-success w-100" type="submit">Register</button>
        <div className="mt-2">
          <small>
            Already have account? <a href="/login">Login</a>
          </small>
        </div>
      </form>
    </div>
  );
}
