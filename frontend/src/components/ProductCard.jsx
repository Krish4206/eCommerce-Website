import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaEye, FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { showToast } from "./ToastNotification";
import { updateWishlistCount } from "../store/wishlistCount";
import api from "../services/api";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const imageUrl =
    product.images?.[0]?.url ||
    product.image ||
    "https://placehold.co/300x300/e2e8f0/94a3b8?text=Product";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }))
      .unwrap()
      .then(() => showToast.cart("Added to cart! 🛒"))
      .catch((err) => showToast.error(err || "Failed to add to cart"));
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isAuthenticated) {
        await api.post("/wishlist/add", { productId: product._id });
      }
      const stored = JSON.parse(
        localStorage.getItem("sanjish_wishlist") || "[]",
      );
      if (!stored.some((item) => item._id === product._id)) {
        stored.push(product);
        localStorage.setItem("sanjish_wishlist", JSON.stringify(stored));
      }
      updateWishlistCount();
      showToast.wishlist("Saved to wishlist ❤️");
    } catch (err) {
      showToast.error(err?.response?.data?.message || "Already in wishlist");
    }
  };

  if (!product) return null;

  const discount =
    product.discount ||
    (product.mrp && product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0);
  const mrp = product.mrp || product.originalPrice || product.price || 0;
  const sellingPrice = product.sellingPrice || product.price || 0;
  const ratings = product.ratings || 0;
  const numReviews = product.numReviews || 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} loading="lazy" />
        <div className="product-actions">
          <button
            type="button"
            className="action-btn"
            title="Add to Wishlist"
            onClick={handleWishlist}
          >
            <FaHeart />
          </button>
          <button
            type="button"
            className="action-btn"
            title="Quick View"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/product/${product._id}`;
            }}
          >
            <FaEye />
          </button>
        </div>
        {discount > 0 && (
          <span className="discount-badge">{discount}% OFF</span>
        )}
        {product.isNewArrival && <span className="new-badge">NEW</span>}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="limited-badge">Limited</span>
        )}
      </div>

      <div className="product-info">
        {product.brand && (
          <span className="product-brand">{product.brand}</span>
        )}
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">
            <FaRupeeSign />
            {sellingPrice.toLocaleString("en-IN")}
          </span>
          {mrp > sellingPrice && (
            <span className="original-price">
              <FaRupeeSign />
              {mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <div className="product-rating">
          <span className="stars">
            {"★".repeat(Math.floor(ratings))}
            {"☆".repeat(5 - Math.floor(ratings))}
          </span>
          <span className="rating-count">({numReviews})</span>
        </div>
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
