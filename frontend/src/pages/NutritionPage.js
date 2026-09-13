import { Link } from 'react-router-dom';

function NutritionPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero page-hero-nutrition">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Διατροφολογικό Τμήμα</h1>
          <p>Clinical & Sports Nutrition</p>
        </div>
      </section>

      {/* Nutrition Detail */}
      <section className="section nutrition-detail">
        <div className="container">
          <p className="section-subtitle" style={{ marginBottom: 20 }}>
            Έμφαση στους τίτλους της διατροφολόγου — εξειδίκευση σε επίπεδο Διδακτορικού
          </p>
          <div className="nutrition-grid">
            <div className="nutrition-card">
              <div className="nutrition-number">01</div>
              <h3>Αθλητική Διατροφή</h3>
              <p>
                Μεγιστοποίηση της απόδοσης και της αποκατάστασης.
                Διατροφικά πλάνα σχεδιασμένα για τους στόχους σας,
                είτε πρόκειται για αθλητική επίδοση είτε για βελτίωση σύνθεσης σώματος.
              </p>
            </div>
            <div className="nutrition-card">
              <div className="nutrition-number">02</div>
              <h3>Κλινική Διατροφή</h3>
              <p>
                Διατροφική υποστήριξη για παθολογικές καταστάσεις.
                Η εξειδίκευση σε επίπεδο Διδακτορικού εγγυάται
                τεκμηριωμένη προσέγγιση στη διατροφική παρέμβαση.
              </p>
            </div>
            <div className="nutrition-card">
              <div className="nutrition-number">03</div>
              <h3>Εξατομικευμένα Πλάνα</h3>
              <p>
                Διατροφικά πλάνα βασισμένα στις ανάγκες και το ιατρικό
                ιστορικό σας. Προσαρμογή σε αλλεργίες, δυσανεξίες
                και προσωπικές προτιμήσεις.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section page-cta">
        <div className="container page-cta-inner">
          <h2>Ξεκινήστε το διατροφικό σας πλάνο</h2>
          <p>Εξατομικευμένη διατροφική υποστήριξη με επιστημονική βάση.</p>
          <Link to="/booking" className="btn btn-primary">Κλείστε Ραντεβού</Link>
        </div>
      </section>
    </>
  );
}

export default NutritionPage;
