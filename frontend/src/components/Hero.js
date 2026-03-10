import React from 'react';

function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero">
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
          <button className="btn btn-primary" onClick={() => scrollTo('services')}>
            Οι Υπηρεσίες μας
          </button>
          <button className="btn btn-outline" onClick={() => scrollTo('contact')}>
            Κλείστε Ραντεβού
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
