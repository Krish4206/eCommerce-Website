import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HomeEnhanced.css";

const HomeEnhanced = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, best, newAr, sale] = await Promise.all([
          axios.get("/api/v1/products/featured?limit=8"),
          axios.get("/api/v1/products/bestsellers?limit=8"),
          axios.get("/api/v1/products/new-arrivals?limit=8"),
          axios.get("/api/v1/products/on-sale?limit=8"),
        ]);

        setFeaturedProducts(featured.data.data.products);
        setBestSellers(best.data.data.products);
        setNewArrivals(newAr.data.data.products);
        setOnSaleProducts(sale.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-enhanced">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>SANJISH</h1>
            <p className="tagline">
              Where Trust Meets Style, Crafted with Love
            </p>
            <p className="subtitle">
              Discover premium fashion & lifestyle products
            </p>
            <Link to="/products" className="hero-cta">
              SHOP NOW
            </Link>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1555529392-64d4c50f87a6?w=800"
              alt="Fashion Hero"
            />
          </div>
        </div>

        {/* Special Offers */}
        <div className="special-offers">
          <div className="offer-card">
            <span className="offer-badge">Up to 50% OFF</span>
            <p>New Arrivals</p>
          </div>
          <div className="offer-card">
            <span className="offer-badge">Free Delivery</span>
            <p>Orders above ₹500</p>
          </div>
          <div className="offer-card">
            <span className="offer-badge">7-Day Returns</span>
            <p>Easy Exchange</p>
          </div>
          <div className="offer-card">
            <span className="offer-badge">100% Original</span>
            <p>Authentic Products</p>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="category-shortcuts">
        <h2>Shop By Category</h2>
        <div className="categories-grid">
          {[
            { name: "Men", icon: "👔" },
            { name: "Women", icon: "👗" },
            { name: "Kids", icon: "🧒" },
            { name: "Home & Living", icon: "🏠" },
            { name: "Accessories", icon: "👜" },
            { name: "Footwear", icon: "👟" },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="category-card"
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>FEATURED PRODUCTS</h2>
          <Link to="/products?featured=true" className="see-all">
            See All →
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCardHome key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bestsellers-section">
        <div className="section-header">
          <h2>BESTSELLERS</h2>
          <Link to="/products?bestseller=true" className="see-all">
            See All →
          </Link>
        </div>
        <div className="products-grid">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCardHome key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* On Sale */}
      <section className="sale-section">
        <div className="section-header">
          <h2>LIMITED TIME OFFERS</h2>
          <Link to="/products?onSale=true" className="see-all">
            See All →
          </Link>
        </div>
        <div className="products-grid">
          {onSaleProducts.slice(0, 4).map((product) => (
            <ProductCardHome key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals-section">
        <div className="section-header">
          <h2>NEW ARRIVALS</h2>
          <Link to="/products?new=true" className="see-all">
            See All →
          </Link>
        </div>
        <div className="products-grid">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCardHome key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="trust-item">
          <div className="trust-icon">✓</div>
          <h3>100% Original Products</h3>
          <p>Authentic items from verified brands</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">📦</div>
          <h3>Fast Delivery</h3>
          <p>Delivery within 2-5 business days</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">↩</div>
          <h3>Easy Returns</h3>
          <p>7-day return policy, no questions asked</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">🔒</div>
          <h3>Secure Payment</h3>
          <p>Multiple payment options with SSL protection</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get exclusive offers and updates delivered to your inbox</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>SUBSCRIBE</button>
        </div>
      </section>
    </div>
  );
};

// Simple Product Card Component for Home
const ProductCardHome = ({ product }) => (
  <Link to={`/product/${product._id}`} className="product-card-home">
    <div className="product-image-home">
      <img src={product.images?.[0]?.url} alt={product.name} loading="lazy" />
      {product.discount > 0 && (
        <div className="discount-badge-home">{product.discount}% OFF</div>
      )}
    </div>
    <div className="product-info-home">
      <div className="brand">{product.brand}</div>
      <div className="name">{product.name}</div>
      <div className="rating">
        {"★".repeat(Math.round(product.ratings))} ({product.numReviews})
      </div>
      <div className="price">
        <span className="current">₹{product.sellingPrice}</span>
        {product.mrp > product.sellingPrice && (
          <span className="original">₹{product.mrp}</span>
        )}
      </div>
    </div>
  </Link>
);

export default HomeEnhanced;
