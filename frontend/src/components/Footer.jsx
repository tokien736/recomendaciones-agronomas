import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../css/style.css';

const Footer = () => {
  return (
    <footer className="footer-bottom mt-auto py-4 bg-dark text-white">
      <div className="container text-center">
        <span className="text-muted">© {new Date().getFullYear()} Todos los derechos reservados</span>
        <div className="social-icons mt-3">
          <a href="https://facebook.com" className="mx-2 text-white" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="https://twitter.com" className="mx-2 text-white" aria-label="Twitter">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://instagram.com" className="mx-2 text-white" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
