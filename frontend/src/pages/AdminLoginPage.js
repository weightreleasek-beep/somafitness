import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8001';

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('soma_admin_token', data.access_token);
        localStorage.setItem('soma_admin_role', data.role);
        localStorage.setItem('soma_admin_name', data.display_name);
        navigate('/admin/dashboard');
      } else {
        setError(data.detail || 'Λάθος στοιχεία σύνδεσης.');
      }
    } catch {
      setError('Σφάλμα σύνδεσης.');
    }
    setLoading(false);
  };

  return (
    <section className="admin-login-section">
      <div className="admin-login-card">
        <img src="/images/logo.png" alt="SOMA" className="admin-login-logo" />
        <h2>Admin Panel</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="admin-user">Username</label>
            <input
              type="text" id="admin-user" required
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-pass">Password</label>
            <input
              type="password" id="admin-pass" required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="form-status error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Σύνδεση...' : 'Σύνδεση'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLoginPage;
