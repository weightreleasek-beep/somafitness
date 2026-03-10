import React from 'react';

function Training() {
  return (
    <section id="training" className="section training">
      <div className="container">
        <div className="training-layout">
          <div className="training-images">
            <img src="/images/studio-5.png" alt="Weight training equipment at SOMA" className="training-img-main" />
            <img src="/images/studio-6.png" alt="SOMA studio overview" className="training-img-secondary" />
          </div>
          <div className="training-content">
            <h2 className="section-title">Personal & Semi-Personal Training</h2>
            <p className="section-subtitle">
              Ενδυνάμωση με συνεχή επίβλεψη — πάντα κάποιος από πάνω σου
            </p>
            <div className="training-items">
              <div className="training-item">
                <div className="training-item-marker"></div>
                <div>
                  <h3>Weight Training</h3>
                  <p>
                    Προπόνηση με βάρη με συνεχή επίβλεψη.
                    Σωστή τεχνική, προοδευτική υπερφόρτωση και
                    εξατομικευμένος προγραμματισμός.
                  </p>
                </div>
              </div>
              <div className="training-item">
                <div className="training-item-marker"></div>
                <div>
                  <h3>Functional Training</h3>
                  <p>
                    Βελτίωση της καθημερινής λειτουργικότητας και δύναμης.
                    Ασκήσεις που μεταφέρονται στην πραγματική ζωή.
                  </p>
                </div>
              </div>
              <div className="training-item">
                <div className="training-item-marker"></div>
                <div>
                  <h3>Για Όλους</h3>
                  <p>
                    Από αθλητές μέχρι άτομα που ξεκινούν τώρα τη γυμναστική.
                    Κάθε πρόγραμμα προσαρμόζεται στο δικό σας επίπεδο.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Training;
