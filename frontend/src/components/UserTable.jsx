import { useState, useEffect } from 'react';
import API from '../services/api';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [sortDesc, setSortDesc] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchUsers = async () => {
    const sortParam = sortDesc ? 'last_login_desc' : '';
    try {
      const res = await API.get(`/users?sort=${sortParam}`);
      setUsers(res.data.users);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortDesc]);

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected(new Set(users.map(u => u.id)));
    } else {
      setSelected(new Set());
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const perform = async (type) => {
    if (!selected.size) return;
    const ids = Array.from(selected);
    try {
      if (type === 'block') await API.patch('/users/block', { ids });
      if (type === 'unblock') await API.patch('/users/unblock', { ids });
      if (type === 'delete') await API.delete('/users', { data: { ids } });
      setMessage(`Successfully ${type}ed ${ids.length} users`);
      setSelected(new Set());
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex gap-2">
          <button disabled={!selected.size} className="btn btn-outline-secondary" onClick={() => perform('block')}>Block</button>
          <button disabled={!selected.size} className="btn btn-outline-secondary" onClick={() => perform('unblock')}>Unblock</button>
          <button disabled={!selected.size} className="btn btn-outline-danger" onClick={() => perform('delete')}>Delete</button>
        </div>
        <div>
          <button className="btn btn-sm btn-link" onClick={() => setSortDesc(d => !d)}>
            Sort by Last Login {sortDesc ? '↓' : '↑'}
          </button>
        </div>
      </div>

      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                aria-label="select all"
                onChange={toggleAll}
                checked={users.length > 0 && selected.size === users.length}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>
              Last Login{' '}
              <button className="btn btn-sm btn-link p-0" onClick={() => setSortDesc(d => !d)}>
                {sortDesc ? '↓' : '↑'}
              </button>
            </th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`select ${u.email}`}
                  checked={selected.has(u.id)}
                  onChange={() => toggleOne(u.id)}
                />
              </td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.last_login ? new Date(u.last_login).toLocaleString() : '-'}</td>
              <td>
                {u.status === 'active' && <span className="badge bg-success">active</span>}
                {u.status === 'blocked' && <span className="badge bg-danger">blocked</span>}
                {u.status === 'deleted' && <span className="badge bg-secondary">deleted</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
