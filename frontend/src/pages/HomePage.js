import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src="/images/logo.png" alt="SOMA" className="hero-logo" />
          <p className="hero-subtitle">Fitness Studio</p>
          <h1 className="hero-slogan">
            Επιστημονική προσέγγιση<br />στην κίνηση και την υγεία.
          </h1>
          <p className="hero-description">
            Ένας εξειδικευμένος χώρος Pilates και ενδυνάμωσης που γεφυρώνει
            το χάσμα μεταξύ αποκατάστασης και προπόνησης.
          </p>
          <div className="hero-buttons">
            <Link to="/pilates" className="btn btn-primary">Οι Υπηρεσίες μας</Link>
            <Link to="/booking" className="btn btn-outline">Κλείστε Ραντεβού</Link>
          </div>
        </div>
      </section>

      {/* Preview Cards */}
      <section className="section home-preview">
        <div className="container">
          <div className="preview-grid">
            <Link to="/pilates" className="preview-card">
              <div className="preview-card-image">
                <img src="/images/studio-3.png" alt="Pilates Reformer" />
              </div>
              <div className="preview-card-content">
                <h3>Pilates & Αποκατάσταση</h3>
                <p>Εξειδικευμένα προγράμματα Reformer & Mat με επιστημονική τεκμηρίωση.</p>
                <span className="preview-card-link">Μάθετε περισσότερα &rarr;</span>
              </div>
            </Link>
            <Link to="/training" className="preview-card">
              <div className="preview-card-image">
                <img src="/images/studio-5.png" alt="Personal Training" />
              </div>
              <div className="preview-card-content">
                <h3>Personal Training</h3>
                <p>Ενδυνάμωση με συνεχή επίβλεψη — πάντα κάποιος από πάνω σου.</p>
                <span className="preview-card-link">Μάθετε περισσότερα &rarr;</span>
              </div>
            </Link>
            <Link to="/nutrition" className="preview-card">
              <div className="preview-card-image">
                <img src="/images/studio-6.png" alt="Διατροφή" />
              </div>
              <div className="preview-card-content">
                <h3>Διατροφολογικό Τμήμα</h3>
                <p>Clinical & Sports Nutrition με εξατομικευμένα πλάνα.</p>
                <span className="preview-card-link">Μάθετε περισσότερα &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Teaser */}
      <section className="section home-why-us">
        <div className="container">
          <div className="home-why-us-layout">
            <div className="home-why-us-text">
              <h2 className="section-title">Γιατί SOMA;</h2>
              <p>
                Δεν είμαστε "απλοί trainers". Είμαστε επιστήμονες της άσκησης
                και της υγείας, με ακαδημαϊκή κατάρτιση, συνεργασία με γιατρούς
                και zero-risk προσέγγιση στην προπόνηση.
              </p>
              <Link to="/about" className="btn btn-primary">Γνωρίστε μας</Link>
            </div>
            <div className="home-why-us-images">
              <img src="/images/studio-4.png" alt="SOMA studio" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section home-cta">
        <div className="container home-cta-inner">
          <h2>Ξεκινήστε σήμερα</h2>
          <p>Κλείστε το πρώτο σας ραντεβού και ανακαλύψτε τη διαφορά.</p>
          <Link to="/booking" className="btn btn-primary">Κλείστε Ραντεβού</Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;
