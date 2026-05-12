import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaSignOutAlt,
  FaStore,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { logout } from "../store/slices/authSlice";
import SanjishLogo from "./SanjishLogo";
import { useWishlistCount } from "../store/wishlistCount";
import "./Navigation.css";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const wishlistCount = useWishlistCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <SanjishLogo size="md" />
          </Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`nav-link ${isActive("/products") ? "active" : ""}`}
            >
              Products
            </Link>

            <Link to="/wishlist" className="nav-icon-link" title="Wishlist">
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className="nav-icon-link" title="Shopping Cart">
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <Link
                  to="/profile"
                  className="nav-icon-link"
                  title="My Account"
                >
                  <div className="user-avatar-mini">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="user-name">{user?.name?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-icon-link logout-btn"
                  title="Sign Out"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <Link to="/login" className="nav-btn nav-btn-login">
                  <FaUser /> Sign In
                </Link>
                <Link to="/register" className="nav-btn nav-btn-register">
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Side Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          {isAuthenticated ? (
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {user?.name || "User"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                  {user?.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="user-info">
              <div className="user-avatar">G</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Guest</div>
              </div>
            </div>
          )}
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <form className="mobile-search" onSubmit={handleSearch}>
          <div className="nav-search" style={{ maxWidth: "100%" }}>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </div>
        </form>

        <Link to="/" className="mobile-nav-link">
          <FaStore /> Home
        </Link>
        <Link to="/products" className="mobile-nav-link">
          <FaSearch /> Products
        </Link>
        <Link to="/cart" className="mobile-nav-link">
          <FaShoppingCart /> Cart ({totalItems})
        </Link>

        <div
          style={{
            height: 1,
            background: "var(--gray-100)",
            margin: "0.5rem 0",
          }}
        />

        {isAuthenticated ? (
          <>
            <Link to="/profile" className="mobile-nav-link">
              <FaUser /> My Account
            </Link>
            <button onClick={handleLogout} className="mobile-nav-link danger">
              <FaSignOutAlt /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-nav-link">
              <FaUser /> Sign In
            </Link>
            <Link to="/register" className="mobile-nav-link">
              <FaUser /> Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navigation;
