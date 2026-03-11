import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8001';

function AdminDashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirmMsg, setConfirmMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'staff'
  const navigate = useNavigate();

  const token = localStorage.getItem('soma_admin_token');
  const userRole = localStorage.getItem('soma_admin_role') || 'staff';
  const userName = localStorage.getItem('soma_admin_name') || '';

  const authFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (res.status === 401) {
      localStorage.removeItem('soma_admin_token');
      localStorage.removeItem('soma_admin_role');
      localStorage.removeItem('soma_admin_name');
      navigate('/admin');
      return null;
    }
    return res;
  }, [token, navigate]);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const res = await authFetch('/api/admin/sessions');
    if (res) {
      const data = await res.json();
      setSessions(data);
    }
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchSessions();
  }, [token, navigate, fetchSessions]);

  const fetchBookings = async (sessionId) => {
    const res = await authFetch(`/api/admin/sessions/${sessionId}/bookings`);
    if (res) {
      const data = await res.json();
      setBookings(data.bookings);
      setSelectedSession(data.session);
    }
  };

  const toggleAttendance = async (bookingId) => {
    const res = await authFetch(`/api/admin/toggle-attendance/${bookingId}`, { method: 'POST' });
    if (res) {
      setBookings((prev) =>
        prev.map((b) => b.id === bookingId ? { ...b, is_confirmed_attendance: !b.is_confirmed_attendance } : b)
      );
      fetchSessions();
    }
  };

  const confirmByCode = async () => {
    if (confirmCode.length !== 4) return;
    setConfirmMsg(null);
    const res = await authFetch('/api/admin/confirm-attendance', {
      method: 'POST',
      body: JSON.stringify({ confirmation_code: confirmCode }),
    });
    if (res) {
      const data = await res.json();
      if (res.ok) {
        setConfirmMsg({ type: 'success', text: data.message });
        setConfirmCode('');
        fetchSessions();
        if (selectedSession) fetchBookings(selectedSession.id);
      } else {
        setConfirmMsg({ type: 'error', text: data.detail });
      }
    }
  };

  const deleteSession = async (id) => {
    if (!window.confirm('Διαγραφή μαθήματος;')) return;
    await authFetch(`/api/admin/sessions/${id}`, { method: 'DELETE' });
    fetchSessions();
    if (selectedSession?.id === id) {
      setSelectedSession(null);
      setBookings([]);
    }
  };

  const toggleActive = async (session) => {
    await authFetch(`/api/admin/sessions/${session.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !session.is_active }),
    });
    fetchSessions();
  };

  const handleLogout = () => {
    localStorage.removeItem('soma_admin_token');
    localStorage.removeItem('soma_admin_role');
    localStorage.removeItem('soma_admin_name');
    navigate('/admin');
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'];
    return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <img src="/images/logo.png" alt="SOMA" className="admin-logo" />
          <h1>Admin Dashboard</h1>
          {userName && <span className="admin-user-badge">{userName} ({userRole === 'admin' ? 'Διαχειριστής' : 'Προσωπικό'})</span>}
        </div>
        <div className="admin-header-right">
          {userRole === 'admin' && (
            <div className="admin-nav-tabs">
              <button
                className={`admin-nav-tab ${activeTab === 'sessions' ? 'active' : ''}`}
                onClick={() => setActiveTab('sessions')}
              >
                Μαθήματα
              </button>
              <button
                className={`admin-nav-tab ${activeTab === 'staff' ? 'active' : ''}`}
                onClick={() => setActiveTab('staff')}
              >
                Προσωπικό
              </button>
            </div>
          )}
          <button className="btn btn-outline admin-logout" onClick={handleLogout}>Αποσύνδεση</button>
        </div>
      </div>

      {activeTab === 'sessions' ? (
        <>
          {/* Quick Confirm */}
          <div className="admin-confirm-bar">
            <h3>Γρήγορη Επιβεβαίωση Παρουσίας</h3>
            <div className="confirm-code-input">
              <input
                type="text"
                maxLength={4}
                placeholder="4-ψήφιος κωδικός"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={(e) => e.key === 'Enter' && confirmByCode()}
              />
              <button className="btn btn-primary" onClick={confirmByCode}>Επιβεβαίωση</button>
            </div>
            {confirmMsg && (
              <div className={`form-status ${confirmMsg.type}`}>{confirmMsg.text}</div>
            )}
          </div>

          <div className="admin-body">
            {/* Sessions List */}
            <div className="admin-sessions-panel">
              <div className="admin-panel-header">
                <h2>Μαθήματα / Slots</h2>
                <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                  {showCreateForm ? 'Ακύρωση' : '+ Νέο Μάθημα'}
                </button>
              </div>

              {showCreateForm && (
                <CreateSessionForm
                  authFetch={authFetch}
                  onCreated={() => { setShowCreateForm(false); fetchSessions(); }}
                />
              )}

              {loading ? (
                <p className="admin-loading">Φόρτωση...</p>
              ) : sessions.length === 0 ? (
                <p className="admin-empty">Δεν υπάρχουν μαθήματα. Δημιουργήστε ένα!</p>
              ) : (
                <div className="admin-sessions-list">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className={`admin-session-card ${selectedSession?.id === s.id ? 'selected' : ''} ${!s.is_active ? 'inactive' : ''}`}
                      onClick={() => fetchBookings(s.id)}
                    >
                      <div className="admin-session-top">
                        <span className={`admin-type-badge ${s.session_type}`}>
                          {s.session_type === 'pilates' ? 'Pilates' : s.session_type === 'gym' ? 'Gym' : 'Διατροφ.'}
                        </span>
                        <span className="admin-session-date">{formatDate(s.date)}</span>
                      </div>
                      <h4>{s.title}</h4>
                      <p className="admin-session-time">{s.start_time} - {s.end_time}</p>
                      <div className="admin-session-stats">
                        <span>{s.booked_seats}/{s.max_seats} κρατήσεις</span>
                        <span>{s.confirmed_count} παρόντες</span>
                      </div>
                      <div className="admin-session-bar">
                        <div className="admin-session-bar-fill" style={{ width: `${(s.booked_seats / s.max_seats) * 100}%` }}></div>
                      </div>
                      <div className="admin-session-actions">
                        <button onClick={(e) => { e.stopPropagation(); toggleActive(s); }}>
                          {s.is_active ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                        </button>
                        <button className="danger" onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}>
                          Διαγραφή
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings Detail */}
            <div className="admin-bookings-panel">
              {selectedSession ? (
                <>
                  <h2>{selectedSession.title}</h2>
                  <p className="admin-bookings-info">
                    {formatDate(selectedSession.date)} | {selectedSession.start_time} - {selectedSession.end_time} |
                    Μέγ. θέσεις: {selectedSession.max_seats}
                  </p>
                  {bookings.length === 0 ? (
                    <p className="admin-empty">Δεν υπάρχουν κρατήσεις.</p>
                  ) : (
                    <div className="admin-bookings-list">
                      {bookings.map((b) => (
                        <div key={b.id} className={`admin-booking-row ${b.is_confirmed_attendance ? 'confirmed' : ''}`}>
                          <button
                            className={`attendance-check ${b.is_confirmed_attendance ? 'checked' : ''}`}
                            onClick={() => toggleAttendance(b.id)}
                          >
                            {b.is_confirmed_attendance ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : null}
                          </button>
                          <div className="booking-info">
                            <strong>{b.name}</strong>
                            <span>{b.email}</span>
                            {b.phone && <span>{b.phone}</span>}
                          </div>
                          <div className="booking-code">
                            {b.confirmation_code}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="admin-bookings-placeholder">
                  <p>Επιλέξτε ένα μάθημα για να δείτε τις κρατήσεις.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <StaffManagement authFetch={authFetch} />
      )}
    </div>
  );
}


function StaffManagement({ authFetch }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', display_name: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ display_name: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const res = await authFetch('/api/admin/staff');
    if (res) {
      const data = await res.json();
      setStaff(data);
    }
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const res = await authFetch('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (res) {
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setForm({ username: '', password: '', display_name: '' });
        setShowForm(false);
        fetchStaff();
      } else {
        setError(data.detail || 'Σφάλμα δημιουργίας.');
      }
    }
  };

  const handleUpdate = async (userId) => {
    setError('');
    setSuccessMsg('');
    const body = {};
    if (editForm.display_name) body.display_name = editForm.display_name;
    if (editForm.password) body.password = editForm.password;
    const res = await authFetch(`/api/admin/staff/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (res) {
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setEditingId(null);
        fetchStaff();
      } else {
        setError(data.detail || 'Σφάλμα ενημέρωσης.');
      }
    }
  };

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Διαγραφή λογαριασμού "${username}";`)) return;
    setError('');
    setSuccessMsg('');
    const res = await authFetch(`/api/admin/staff/${userId}`, { method: 'DELETE' });
    if (res) {
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        fetchStaff();
      } else {
        setError(data.detail || 'Σφάλμα διαγραφής.');
      }
    }
  };

  return (
    <div className="staff-management">
      <div className="staff-header">
        <h2>Διαχείριση Προσωπικού</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Ακύρωση' : '+ Νέος Λογαριασμός'}
        </button>
      </div>

      {error && <div className="form-status error" style={{ margin: '0 32px 16px' }}>{error}</div>}
      {successMsg && <div className="form-status success" style={{ margin: '0 32px 16px' }}>{successMsg}</div>}

      {showForm && (
        <form className="staff-create-form" onSubmit={handleCreate}>
          <div className="create-form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text" required placeholder="π.χ. maria"
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Ονοματεπώνυμο</label>
              <input
                type="text" placeholder="π.χ. Μαρία Παπαδοπούλου"
                value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Κωδικός</label>
              <input
                type="password" required minLength={4} placeholder="Τουλάχιστον 4 χαρακτήρες"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Δημιουργία Λογαριασμού</button>
        </form>
      )}

      {loading ? (
        <p className="admin-loading">Φόρτωση...</p>
      ) : staff.length === 0 ? (
        <p className="admin-empty">Δεν υπάρχουν λογαριασμοί.</p>
      ) : (
        <div className="staff-list">
          {staff.map((u) => (
            <div key={u.id} className="staff-card">
              {editingId === u.id ? (
                <div className="staff-edit-form">
                  <div className="create-form-row">
                    <div className="form-group">
                      <label>Ονοματεπώνυμο</label>
                      <input
                        type="text"
                        value={editForm.display_name}
                        onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Νέος Κωδικός (κενό = αμετάβλητος)</label>
                      <input
                        type="password"
                        placeholder="Αφήστε κενό για να μην αλλάξει"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="staff-edit-actions">
                    <button className="btn btn-primary" onClick={() => handleUpdate(u.id)}>Αποθήκευση</button>
                    <button className="btn btn-outline-dark" onClick={() => setEditingId(null)}>Ακύρωση</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="staff-info">
                    <div className="staff-avatar">
                      {(u.display_name || u.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="staff-details">
                      <strong>{u.display_name}</strong>
                      <span className="staff-username">@{u.username}</span>
                    </div>
                    <span className={`staff-role-badge ${u.role}`}>
                      {u.role === 'admin' ? 'Διαχειριστής' : 'Προσωπικό'}
                    </span>
                  </div>
                  {u.role !== 'admin' && (
                    <div className="staff-actions">
                      <button onClick={() => { setEditingId(u.id); setEditForm({ display_name: u.display_name, password: '' }); }}>
                        Επεξεργασία
                      </button>
                      <button className="danger" onClick={() => handleDelete(u.id, u.username)}>
                        Διαγραφή
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function CreateSessionForm({ authFetch, onCreated }) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [form, setForm] = useState({
    session_type: 'pilates',
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    max_seats: 6,
  });
  const [recurring, setRecurring] = useState({
    days: [],
    from_date: '',
    to_date: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const dayNames = [
    { value: 0, label: 'Δευ' },
    { value: 1, label: 'Τρι' },
    { value: 2, label: 'Τετ' },
    { value: 3, label: 'Πεμ' },
    { value: 4, label: 'Παρ' },
    { value: 5, label: 'Σαβ' },
  ];

  const toggleDay = (day) => {
    setRecurring((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    let res;
    if (isRecurring) {
      res = await authFetch('/api/admin/sessions/recurring', {
        method: 'POST',
        body: JSON.stringify({
          session_type: form.session_type,
          title: form.title,
          start_time: form.start_time,
          end_time: form.end_time,
          max_seats: form.max_seats,
          days: recurring.days,
          from_date: recurring.from_date,
          to_date: recurring.to_date,
        }),
      });
    } else {
      res = await authFetch('/api/admin/sessions', {
        method: 'POST',
        body: JSON.stringify(form),
      });
    }

    if (res) {
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => onCreated(), 1000);
      } else {
        setError(data.detail || 'Σφάλμα δημιουργίας.');
      }
    }
  };

  return (
    <form className="create-session-form" onSubmit={handleSubmit}>
      {/* Mode toggle */}
      <div className="create-mode-toggle">
        <button type="button" className={`mode-btn ${!isRecurring ? 'active' : ''}`} onClick={() => setIsRecurring(false)}>
          Μεμονωμένο
        </button>
        <button type="button" className={`mode-btn ${isRecurring ? 'active' : ''}`} onClick={() => setIsRecurring(true)}>
          Επαναλαμβανόμενο
        </button>
      </div>

      {/* Common fields */}
      <div className="create-form-row">
        <div className="form-group">
          <label>Τύπος</label>
          <select value={form.session_type} onChange={(e) => setForm({ ...form, session_type: e.target.value })}>
            <option value="pilates">Pilates</option>
            <option value="gym">Gym</option>
            <option value="dietitian">Διατροφολόγος</option>
          </select>
        </div>
        <div className="form-group">
          <label>Τίτλος</label>
          <input
            type="text" required placeholder="π.χ. Pilates Reformer"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
      </div>

      <div className="create-form-row">
        <div className="form-group">
          <label>Από</label>
          <input type="time" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Έως</label>
          <input type="time" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Θέσεις</label>
          <input
            type="number" min="1" max="50" required
            value={form.max_seats} onChange={(e) => setForm({ ...form, max_seats: e.target.value === '' ? '' : parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Single date or Recurring options */}
      {!isRecurring ? (
        <div className="create-form-row">
          <div className="form-group">
            <label>Ημερομηνία</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label>Ημέρες εβδομάδας</label>
            <div className="day-picker">
              {dayNames.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  className={`day-btn ${recurring.days.includes(d.value) ? 'selected' : ''}`}
                  onClick={() => toggleDay(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="create-form-row">
            <div className="form-group">
              <label>Από ημερομηνία</label>
              <input
                type="date" required
                value={recurring.from_date}
                onChange={(e) => setRecurring({ ...recurring, from_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Έως ημερομηνία</label>
              <input
                type="date" required
                value={recurring.to_date}
                onChange={(e) => setRecurring({ ...recurring, to_date: e.target.value })}
              />
            </div>
          </div>
        </>
      )}

      {error && <div className="form-status error">{error}</div>}
      {successMsg && <div className="form-status success">{successMsg}</div>}
      <button type="submit" className="btn btn-primary">
        {isRecurring ? 'Δημιουργία Επαναλαμβανόμενων' : 'Δημιουργία'}
      </button>
    </form>
  );
}

export default AdminDashboardPage;
