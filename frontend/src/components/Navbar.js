import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="SOMA" />
        </Link>
        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {menuOpen && <div className="navbar-backdrop" onClick={() => setMenuOpen(false)} />}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Αρχική</Link></li>
          <li><Link to="/pilates" className={isActive('/pilates') ? 'active' : ''}>Pilates</Link></li>
          <li><Link to="/training" className={isActive('/training') ? 'active' : ''}>Ενδυνάμωση</Link></li>
          <li><Link to="/nutrition" className={isActive('/nutrition') ? 'active' : ''}>Διατροφή</Link></li>
          <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>Γιατί Εμάς</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Επικοινωνία</Link></li>
          <li><Link to="/booking" className="nav-cta">Κλείστε Ραντεβού</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
