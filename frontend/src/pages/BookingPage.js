import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8001';

function BookingPage() {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('pilates');
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch {
      setError('Σφάλμα φόρτωσης. Δοκιμάστε ξανά.');
    }
    setLoading(false);
  };

  const filtered = sessions.filter((s) => s.session_type === activeTab);

  // Group by date
  const grouped = filtered.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    const months = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    setBookingLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: selectedSession.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingResult(data);
        setForm({ name: '', email: '', phone: '' });
        setSelectedSession(null);
        fetchSessions();
      } else {
        setError(data.detail || 'Κάτι πήγε στραβά.');
      }
    } catch {
      setError('Σφάλμα σύνδεσης.');
    }
    setBookingLoading(false);
  };

  // Success screen
  if (bookingResult) {
    return (
      <>
        <section className="page-hero">
          <div className="page-hero-overlay"></div>
          <div className="page-hero-content">
            <h1>Κλείστε Ραντεβού</h1>
            <p>Επιλέξτε μάθημα και ώρα</p>
          </div>
        </section>
        <section className="section booking-success-section">
          <div className="container">
            <div className="booking-success">
              <div className="success-icon">
                <svg viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="#c4866e" strokeWidth="2" />
                  <path d="M20 32l8 8 16-16" stroke="#c4866e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Η κράτησή σας ολοκληρώθηκε!</h2>
              <p className="success-session">{bookingResult.booking.session_title}</p>
              <p className="success-datetime">
                {formatDate(bookingResult.booking.date)} | {bookingResult.booking.time}
              </p>
              <div className="confirmation-code-display">
                <p>Κωδικός Επιβεβαίωσης</p>
                <div className="code-digits">
                  {bookingResult.confirmation_code.split('').map((d, i) => (
                    <span key={i} className="code-digit">{d}</span>
                  ))}
                </div>
              </div>
              <p className="success-email-note">
                Ένα email επιβεβαίωσης στάλθηκε στο email σας.
              </p>
              <button className="btn btn-primary" onClick={() => setBookingResult(null)}>
                Νέα Κράτηση
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Κλείστε Ραντεβού</h1>
          <p>Επιλέξτε μάθημα και ώρα — δείτε τις διαθέσιμες θέσεις σε πραγματικό χρόνο</p>
        </div>
      </section>

      <section className="section booking-section">
        <div className="container">
          {/* Tabs */}
          <div className="booking-tabs">
            <button
              className={`booking-tab ${activeTab === 'pilates' ? 'active' : ''}`}
              onClick={() => { setActiveTab('pilates'); setSelectedSession(null); }}
            >
              Pilates
            </button>
            <button
              className={`booking-tab ${activeTab === 'gym' ? 'active' : ''}`}
              onClick={() => { setActiveTab('gym'); setSelectedSession(null); }}
            >
              Gym
            </button>
            <button
              className={`booking-tab ${activeTab === 'dietitian' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dietitian'); setSelectedSession(null); }}
            >
              Διατροφολόγος
            </button>
          </div>

          <div className="booking-layout">
            {/* Sessions list */}
            <div className="booking-sessions">
              {loading ? (
                <p className="booking-loading">Φόρτωση προγράμματος...</p>
              ) : Object.keys(grouped).length === 0 ? (
                <p className="booking-empty">Δεν υπάρχουν διαθέσιμα μαθήματα αυτή τη στιγμή.</p>
              ) : (
                Object.entries(grouped).map(([dateStr, dateSessions]) => (
                  <div key={dateStr} className="booking-day">
                    <h3 className="booking-day-title">{formatDate(dateStr)}</h3>
                    <div className="booking-day-slots">
                      {dateSessions.map((s) => (
                        <button
                          key={s.id}
                          className={`booking-slot ${selectedSession?.id === s.id ? 'selected' : ''} ${s.available_seats === 0 ? 'full' : ''}`}
                          onClick={() => s.available_seats > 0 && setSelectedSession(s)}
                          disabled={s.available_seats === 0}
                        >
                          <div className="slot-time">{s.start_time} - {s.end_time}</div>
                          <div className="slot-title">{s.title}</div>
                          <div className="slot-seats">
                            <span className={`seat-badge ${s.available_seats <= 2 ? 'low' : ''} ${s.available_seats === 0 ? 'none' : ''}`}>
                              {s.available_seats === 0
                                ? 'Πλήρες'
                                : `${s.available_seats}/${s.max_seats} θέσεις`}
                            </span>
                          </div>
                          <div className="slot-bar">
                            <div
                              className="slot-bar-fill"
                              style={{ width: `${(s.booked_seats / s.max_seats) * 100}%` }}
                            ></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Booking form */}
            <div className={`booking-form-panel ${selectedSession ? 'visible' : ''}`}>
              {selectedSession ? (
                <form className="booking-form" onSubmit={handleBook}>
                  <h3>Κράτηση Θέσης</h3>
                  <div className="selected-session-info">
                    <span className="selected-type">{selectedSession.session_type === 'pilates' ? 'Pilates' : selectedSession.session_type === 'gym' ? 'Gym' : 'Διατροφολόγος'}</span>
                    <p className="selected-title">{selectedSession.title}</p>
                    <p className="selected-datetime">
                      {formatDate(selectedSession.date)} | {selectedSession.start_time} - {selectedSession.end_time}
                    </p>
                    <p className="selected-seats">{selectedSession.available_seats} θέσεις διαθέσιμες</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-name">Ονοματεπώνυμο *</label>
                    <input
                      type="text" id="book-name" required
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-email">Email *</label>
                    <input
                      type="email" id="book-email" required
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-phone">Τηλέφωνο</label>
                    <input
                      type="tel" id="book-phone"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  {error && <div className="form-status error">{error}</div>}
                  <button type="submit" className="btn btn-primary btn-full" disabled={bookingLoading}>
                    {bookingLoading ? 'Κράτηση...' : 'Επιβεβαίωση Κράτησης'}
                  </button>
                </form>
              ) : (
                <div className="booking-form-placeholder">
                  <p>Επιλέξτε ένα μάθημα από αριστερά για να κάνετε κράτηση.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookingPage;
