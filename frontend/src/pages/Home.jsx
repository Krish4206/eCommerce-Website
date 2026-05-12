import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import {
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
  FaArrowRight,
  FaFire,
  FaBoxOpen,
  FaTruck,
  FaStar,
  FaCrown,
} from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector(
    (state) => state.products,
  );

  // Deal countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      name: "Men",
      icon: "👔",
      count: "500+ Products",
      className: "category-men",
      desc: "Trendy fashion for men",
    },
    {
      name: "Women",
      icon: "👗",
      count: "800+ Products",
      className: "category-women",
      desc: "Elegant styles for women",
    },
    {
      name: "Kids",
      icon: "🧒",
      count: "300+ Products",
      className: "category-kids",
      desc: "Cute & comfy for kids",
    },
    {
      name: "Home & Living",
      icon: "🏠",
      count: "200+ Products",
      className: "category-home",
      desc: "Beautiful home decor",
    },
    {
      name: "Accessories",
      icon: "👜",
      count: "400+ Products",
      className: "category-accessories",
      desc: "Complete your look",
    },
    {
      name: "Footwear",
      icon: "👟",
      count: "350+ Products",
      className: "category-footwear",
      desc: "Step out in style",
    },
  ];

  const features = [
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      desc: "On orders above ₹499",
    },
    {
      icon: <FaShieldAlt />,
      title: "100% Original",
      desc: "Authentic products guaranteed",
    },
    { icon: <FaUndo />, title: "Easy Returns", desc: "7-day return policy" },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      desc: "Dedicated customer care",
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section - Sanjish */}
      <section className="hero">
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Summer Sale is Live — Up to 60% OFF
          </div>

          <h1>
            <span className="brand-hero">Sanjish</span>
            <br />
            <span className="highlight">Where Trust</span> Meets Style
          </h1>

          <p className="hero-tagline">
            Crafted with Love for India. Discover premium fashion & lifestyle
            collections from the best brands, with authentic products and
            unbeatable prices.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-btn">
              Shop Now <FaArrowRight />
            </Link>
            <Link to="/products?category=Men" className="hero-btn-secondary">
              <FaFire /> Trending Now
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">10K+</span>
              <span className="hero-stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">5K+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">50K+</span>
              <span className="hero-stat-label">Orders Delivered</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">4.8</span>
              <span className="hero-stat-label">
                <FaStar /> Avg. Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="trust-bar-container">
          <div className="trust-bar-item">
            <FaShieldAlt />
            <span>100% Original Products</span>
          </div>
          <div className="trust-bar-divider"></div>
          <div className="trust-bar-item">
            <FaTruck />
            <span>Free Delivery on ₹499+</span>
          </div>
          <div className="trust-bar-divider"></div>
          <div className="trust-bar-item">
            <FaUndo />
            <span>7-Day Easy Returns</span>
          </div>
          <div className="trust-bar-divider"></div>
          <div className="trust-bar-item">
            <FaCrown />
            <span>Premium Quality</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-container">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-icon-wrapper">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked just for you — our most loved styles
            </p>
            <div className="section-header-actions">
              <Link to="/products" className="view-all-btn">
                Browse All Products <FaArrowRight />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">Discovering amazing products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Find exactly what you're looking for
            </p>
          </div>
          <div className="categories-grid six-col">
            {categories.map((cat) => (
              <Link
                to={`/products?category=${cat.name}`}
                key={cat.name}
                className={`category-card ${cat.className}`}
              >
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
                <p className="category-count">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Banner */}
      <section className="deal-banner">
        <div className="deal-banner-content">
          <div className="deal-text">
            <h2>
              Flash Sale <span className="deal-highlight">50% OFF</span>
            </h2>
            <p>
              Grab the hottest deals before they're gone! Limited time offer on
              fashion & lifestyle essentials.
            </p>
            <div className="deal-timer">
              <div className="timer-block">
                <span className="timer-number">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="timer-label">Hours</span>
              </div>
              <div className="timer-block">
                <span className="timer-number">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="timer-label">Minutes</span>
              </div>
              <div className="timer-block">
                <span className="timer-number">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="timer-label">Seconds</span>
              </div>
            </div>
            <Link
              to="/products"
              className="hero-btn"
              style={{ display: "inline-flex" }}
            >
              Shop the Sale <FaArrowRight />
            </Link>
          </div>
          <div className="deal-image">
            <div className="deal-image-placeholder">
              <FaBoxOpen />
              <span className="sale-badge">-50%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-content">
          <h2>Stay in the Loop</h2>
          <p>
            Subscribe to our newsletter and be the first to know about new
            arrivals, exclusive offers, and style inspiration.
          </p>
          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
            />
            <button type="submit">
              Subscribe <FaArrowRight />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
