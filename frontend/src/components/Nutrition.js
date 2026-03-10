import React from 'react';

function Nutrition() {
  return (
    <section id="nutrition" className="section nutrition">
      <div className="container">
        <h2 className="section-title">Διατροφολογικό Τμήμα</h2>
        <p className="section-subtitle">Clinical & Sports Nutrition</p>
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
  );
}

export default Nutrition;
