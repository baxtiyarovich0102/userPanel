import UserTable from '../components/UserTable';
import { useAuth } from '../hooks/useAuth';

export default function UserPanel() {
  const { logout } = useAuth();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>User Management</h4>
        <button className="btn btn-outline-secondary" onClick={logout}>Logout</button>
      </div>
      <UserTable />
    </div>
  );
}
