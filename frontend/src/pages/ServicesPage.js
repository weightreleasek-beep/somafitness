import { Link } from 'react-router-dom';

function ServicesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Pilates & Αποκατάσταση</h1>
          <p>Εξειδικευμένα προγράμματα από απόφοιτο ΤΕΦΑΑ με επιστημονική τεκμηρίωση</p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section services-detail">
        <div className="container">
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 40 Q32 20 44 40" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="32" cy="24" r="6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Pilates Reformer & Mat</h3>
              <p>
                Εστίαση στην ορθοσωμία και τον έλεγχο κίνησης.
                Εξατομικευμένα προγράμματα σε reformer και mat για
                βελτίωση της στάσης, ευλυγισίας και δύναμης.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 32h8l4-12 8 24 8-24 4 12h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Διαχείριση Τραυματισμών</h3>
              <p>
                Εξειδικευμένα προγράμματα για κήλες, δισκοπάθειες
                και μυοσκελετικά προβλήματα. Ασφαλής επιστροφή στην
                κίνηση με επιστημονική καθοδήγηση.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 12v40M22 22h20M22 32h20M22 42h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="32" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Ιατρικό Δίκτυο</h3>
              <p>
                Άμεση συνεργασία με ορθοπεδικούς και φυσικοθεραπευτές
                για την παρακολούθηση της πορείας του ασκούμενου.
                Ολοκληρωμένη φροντίδα από την αποκατάσταση στην προπόνηση.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section page-gallery-section">
        <div className="container">
          <div className="page-gallery">
            <img src="/images/studio-3.png" alt="Pilates Reformer στο SOMA studio" />
            <img src="/images/studio-8.png" alt="SOMA εξοπλισμός Pilates" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section page-cta">
        <div className="container page-cta-inner">
          <h2>Έτοιμοι να ξεκινήσετε;</h2>
          <p>Κλείστε το πρώτο σας ραντεβού Pilates σήμερα.</p>
          <Link to="/booking" className="btn btn-primary">Κλείστε Ραντεβού</Link>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
