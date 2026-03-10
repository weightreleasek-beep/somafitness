import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="SOMA" className="footer-logo" />
            <p>Fitness Studio</p>
            <p className="footer-tagline">
              Επιστημονική προσέγγιση στην κίνηση και την υγεία.
            </p>
          </div>
          <div className="footer-links">
            <h4>Υπηρεσίες</h4>
            <ul>
              <li><Link to="/pilates">Pilates Reformer & Mat</Link></li>
              <li><Link to="/pilates">Διαχείριση Τραυματισμών</Link></li>
              <li><Link to="/training">Personal Training</Link></li>
              <li><Link to="/nutrition">Αθλητική Διατροφή</Link></li>
              <li><Link to="/nutrition">Κλινική Διατροφή</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Πλοήγηση</h4>
            <ul>
              <li><Link to="/">Αρχική</Link></li>
              <li><Link to="/pilates">Pilates & Αποκατάσταση</Link></li>
              <li><Link to="/training">Ενδυνάμωση</Link></li>
              <li><Link to="/booking">Κλείστε Ραντεβού</Link></li>
              <li><Link to="/contact">Επικοινωνία</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SOMA Fitness Studio. All rights reserved.</p>
          <Link to="/admin" className="admin-hidden-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
