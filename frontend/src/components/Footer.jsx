import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaArrowUp,
  FaChevronRight,
  FaShieldAlt,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import SanjishLogo from "./SanjishLogo";
import "./Footer.css";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <Link to="/" className="footer-logo">
              <SanjishLogo size="lg" showTagline />
            </Link>
            <p className="footer-text">
              India's premium fashion & lifestyle destination. Discover curated
              collections from top brands with authentic products, unbeatable
              prices, and exceptional service.
            </p>
            <div className="trust-badges">
              <div className="trust-badge">
                <FaShieldAlt /> 100% Original
              </div>
              <div className="trust-badge">
                <FaUndo /> 7-Day Returns
              </div>
              <div className="trust-badge">
                <FaTruck /> Free Delivery*
              </div>
            </div>
            <div className="social-links">
              <a
                href="https://facebook.com/sanjish"
                className="social-link"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com/sanjish"
                className="social-link"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/sanjish"
                className="social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com/company/sanjish"
                className="social-link"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <FaChevronRight /> Home
                </Link>
              </li>
              <li>
                <Link to="/products">
                  <FaChevronRight /> Shop All
                </Link>
              </li>
              <li>
                <Link to="/products?category=Men">
                  <FaChevronRight /> Men
                </Link>
              </li>
              <li>
                <Link to="/products?category=Women">
                  <FaChevronRight /> Women
                </Link>
              </li>
              <li>
                <Link to="/products?category=Kids">
                  <FaChevronRight /> Kids
                </Link>
              </li>
              <li>
                <Link to="/wishlist">
                  <FaChevronRight /> Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="footer-section">
            <h4>Policies</h4>
            <ul className="footer-links">
              <li>
                <Link to="/shipping-policy">
                  <FaChevronRight /> Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/return-policy">
                  <FaChevronRight /> Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy">
                  <FaChevronRight /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <FaChevronRight /> Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt />
                <span>
                  Sanjish Fashion House,
                  <br />
                  MG Road, Camp,
                  <br />
                  Pune, Maharashtra 411001
                </span>
              </li>
              <li>
                <FaPhone /> +91 98765 43210
              </li>
              <li>
                <FaEnvelope /> support@sanjish.in
              </li>
            </ul>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <p>Subscribe for exclusive deals & offers:</p>
              <form
                className="footer-newsletter-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">
                  <FaHeart /> Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>
              &copy; {new Date().getFullYear()} Sanjish. All rights reserved.
              Made with <FaHeart /> in India.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
            <div className="payment-methods">
              <span className="payment-method-icon" title="UPI">
                UPI
              </span>
              <span className="payment-method-icon" title="Visa">
                Visa
              </span>
              <span className="payment-method-icon" title="Mastercard">
                MC
              </span>
              <span className="payment-method-icon" title="Rupay">
                RuPay
              </span>
              <span className="payment-method-icon" title="COD">
                COD
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        title="Back to top"
      >
        <FaArrowUp />
      </button>
    </>
  );
};

export default Footer;
