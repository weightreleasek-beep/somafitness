import { Link } from 'react-router-dom';

function WhyUsPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero page-hero-about">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Γιατί Εμάς</h1>
          <p>The Team</p>
        </div>
      </section>

      {/* Why Us Detail */}
      <section className="section why-us-detail">
        <div className="container">
          <div className="why-us-grid">
            <div className="why-us-card">
              <div className="why-us-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 8L38 24H54L41 34L45 50L32 40L19 50L23 34L10 24H26L32 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3>Επιστημονικό Υπόβαθρο</h3>
              <p>
                Δεν είμαστε "απλοί trainers". Είμαστε επιστήμονες
                της άσκησης και της υγείας, με ακαδημαϊκή κατάρτιση
                και συνεχή επιστημονική ενημέρωση.
              </p>
            </div>
            <div className="why-us-card">
              <div className="why-us-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 56C32 56 52 44 52 28V16L32 8L12 16V28C12 44 32 56 32 56Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M24 32L30 38L40 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Ασφάλεια</h3>
              <p>
                Η συνεργασία με γιατρούς εγγυάται ότι η προπόνηση
                κάνει καλό, δεν τραυματίζει. Κάθε πρόγραμμα
                σχεδιάζεται με γνώμονα την ασφάλεια.
              </p>
            </div>
            <div className="why-us-card">
              <div className="why-us-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="20" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 52C16 42 23 34 32 34C41 34 48 42 48 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Προσωπική Επίβλεψη</h3>
              <p>
                Zero-risk προπόνηση με συνεχή καθοδήγηση.
                Κάθε άσκηση εκτελείται σωστά, κάθε πρόγραμμα
                προσαρμόζεται στις ανάγκες σας.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Gallery */}
      <section className="section page-gallery-section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 40 }}>Ο Χώρος μας</h2>
          <div className="page-gallery page-gallery-3">
            <img src="/images/studio-4.png" alt="SOMA studio χώρος" />
            <img src="/images/studio-8.png" alt="SOMA studio εξοπλισμός" />
            <img src="/images/studio-1.png" alt="SOMA εξωτερικός χώρος" />
            <img src="/images/studio-2.png" alt="SOMA πρόσοψη" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section page-cta">
        <div className="container page-cta-inner">
          <h2>Ελάτε να μας γνωρίσετε</h2>
          <p>Κλείστε το πρώτο σας ραντεβού και δείτε τη διαφορά από κοντά.</p>
          <Link to="/contact" className="btn btn-primary">Επικοινωνία</Link>
        </div>
      </section>
    </>
  );
}

export default WhyUsPage;
