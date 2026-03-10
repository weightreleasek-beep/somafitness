import { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8001';

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: data.message });
        setForm({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Σφάλμα σύνδεσης. Δοκιμάστε ξανά αργότερα.' });
    }
    setLoading(false);
  };

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero page-hero-contact">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Επικοινωνία</h1>
          <p>Κλείστε το πρώτο σας ραντεβού ή στείλτε μας το ερώτημά σας</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section contact-detail">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <h2 className="section-title">Στοιχεία Επικοινωνίας</h2>
              <div className="contact-details">
                <div className="contact-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>SOMA Fitness Studio</span>
                </div>
                <div className="contact-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <span>Καλέστε μας</span>
                </div>
                <div className="contact-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M22 4l-10 8L2 4"/>
                  </svg>
                  <span>info@somastudio.gr</span>
                </div>
              </div>
              <div className="contact-image">
                <img src="/images/studio-1.png" alt="SOMA Fitness Studio εξωτερικός χώρος" />
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Ονοματεπώνυμο *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Τηλέφωνο</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="service">Υπηρεσία</label>
                <select id="service" name="service" value={form.service} onChange={handleChange}>
                  <option value="">Επιλέξτε υπηρεσία</option>
                  <option value="pilates-reformer">Pilates Reformer</option>
                  <option value="pilates-mat">Pilates Mat</option>
                  <option value="personal-training">Personal Training</option>
                  <option value="semi-personal">Semi-Personal Training</option>
                  <option value="injury-management">Διαχείριση Τραυματισμών</option>
                  <option value="sports-nutrition">Αθλητική Διατροφή</option>
                  <option value="clinical-nutrition">Κλινική Διατροφή</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Μήνυμα *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Αποστολή...' : 'Αποστολή Μηνύματος'}
              </button>
              {status && (
                <div className={`form-status ${status.type}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
