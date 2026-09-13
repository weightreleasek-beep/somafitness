import { Link } from 'react-router-dom';

function TrainingPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero page-hero-training">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1>Personal & Semi-Personal Training</h1>
          <p>Ενδυνάμωση με συνεχή επίβλεψη — πάντα κάποιος από πάνω σου</p>
        </div>
      </section>

      {/* Training Detail */}
      <section className="section training-detail">
        <div className="container">
          <div className="training-layout">
            <div className="training-images">
              <img src="/images/studio-gym.png" alt="Χώρος ενδυνάμωσης στο SOMA" className="training-img-main" />
              <img src="/images/studio-pilates-wide.png" alt="SOMA studio overview" className="training-img-secondary" />
            </div>
            <div className="training-content">
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

      {/* Extra Gallery */}
      <section className="section page-gallery-section">
        <div className="container">
          <div className="page-gallery">
            <img src="/images/studio-gym.png" alt="SOMA εξοπλισμός ενδυνάμωσης" />
            <img src="/images/studio-pilates-tower.png" alt="SOMA χώρος Pilates" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section page-cta">
        <div className="container page-cta-inner">
          <h2>Ξεκινήστε την προπόνησή σας</h2>
          <p>Εξατομικευμένα προγράμματα που προσαρμόζονται στο δικό σας επίπεδο.</p>
          <Link to="/booking" className="btn btn-primary">Κλείστε Ραντεβού</Link>
        </div>
      </section>
    </>
  );
}

export default TrainingPage;
