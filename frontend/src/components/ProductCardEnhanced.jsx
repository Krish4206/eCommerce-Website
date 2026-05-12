import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const discount = product.discount || 0;
  const savings = product.mrp - product.sellingPrice;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div
          className="product-image-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={
              product.images?.[0]?.url || "https://via.placeholder.com/250x330"
            }
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {product.isNewArrival && <span className="badge badge-new">NEW</span>}
          {discount > 0 && (
            <span className="badge badge-discount">{discount}% OFF</span>
          )}
          {product.isBestseller && (
            <span className="badge badge-bestseller">BESTSELLER</span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="badge badge-limited">
              ONLY {product.stock} LEFT
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge badge-outofstock">OUT OF STOCK</span>
          )}

          {/* Quick Actions on Hover */}
          {isHovered && (
            <div className="quick-actions">
              <button
                className="quick-action-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart && onAddToCart(product);
                }}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={18} /> ADD TO CART
              </button>
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <div className="product-name">{product.name}</div>

          {/* Ratings */}
          {product.ratings > 0 && (
            <div className="product-rating">
              <span className="stars">
                {"★".repeat(Math.round(product.ratings))}
              </span>
              <span className="rating-value">({product.numReviews})</span>
            </div>
          )}

          {/* Pricing */}
          <div className="product-price">
            <span className="current-price">
              ₹{product.sellingPrice.toLocaleString()}
            </span>
            {product.mrp > product.sellingPrice && (
              <>
                <span className="original-price">
                  ₹{product.mrp.toLocaleString()}
                </span>
                <span className="discount-percent">{discount}% OFF</span>
              </>
            )}
          </div>

          {savings > 0 && (
            <div className="savings">Save ₹{savings.toLocaleString()}</div>
          )}

          {/* Delivery Info */}
          {product.estimatedDelivery && (
            <div className="delivery-info">
              ✓ Delivery by {product.estimatedDelivery.maxDays} days
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          if (isInWishlist) {
            onRemoveFromWishlist && onRemoveFromWishlist(product._id);
          } else {
            onAddToWishlist && onAddToWishlist(product._id);
          }
        }}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} />
      </button>
    </div>
  );
};

export default ProductCard;
