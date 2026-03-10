import React from 'react';

function WhyUs() {
  return (
    <section id="why-us" className="section why-us">
      <div className="container">
        <h2 className="section-title">Γιατί Εμάς</h2>
        <p className="section-subtitle">The Team</p>
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
        <div className="studio-gallery">
          <img src="/images/studio-4.png" alt="SOMA studio χώρος" />
          <img src="/images/studio-8.png" alt="SOMA studio εξοπλισμός" />
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
