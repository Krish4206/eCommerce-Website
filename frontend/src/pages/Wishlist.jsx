import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaArrowLeft,
  FaRupeeSign,
} from "react-icons/fa";
import { showToast } from "../components/ToastNotification";
import { addToCart } from "../store/slices/cartSlice";
import api from "../services/api";
import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Normalize: API returns {product: {...}}, localStorage stores raw product
  const normalizeItems = (items) => {
    return items
      .map((item) => {
        if (item.product && item.product._id) return item;
        return { product: item };
      })
      .filter((item) => item.product && item.product._id);
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const { data } = await api.get("/wishlist");
        setWishlistItems(normalizeItems(data.data?.items || []));
      } else {
        const stored = JSON.parse(
          localStorage.getItem("sanjish_wishlist") || "[]",
        );
        setWishlistItems(normalizeItems(stored));
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      if (isAuthenticated) {
        await api.delete("/wishlist/remove", { data: { productId } });
      }
      const updated = wishlistItems.filter(
        (item) => item.product._id !== productId,
      );
      setWishlistItems(updated);
      // Save raw products back to localStorage
      localStorage.setItem(
        "sanjish_wishlist",
        JSON.stringify(updated.map((i) => i.product)),
      );
      showToast.success("Removed from wishlist");
    } catch {
      showToast.error("Failed to remove");
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    const prod = product.product || product;
    dispatch(addToCart({ product: prod, quantity: 1 }))
      .unwrap()
      .then(() => {
        showToast.cart("Added to cart! 🛒");
        handleRemove(prod._id);
      })
      .catch((err) => showToast.error(err || "Failed"));
  };

  const getProductData = (item) => item.product;
  const getProductId = (item) => item.product._id;

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="section-loading">
            <div className="loading-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="wishlist-header-left">
            <div className="wishlist-header-icon">
              <FaHeart />
            </div>
            <div>
              <h1>My Wishlist</h1>
              <span className="wishlist-count">
                {wishlistItems.length} items
              </span>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <FaHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite items here and shop them later!</p>
            <Link to="/products" className="wishlist-shop-btn">
              <FaArrowLeft /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => {
              const product = getProductData(item);
              const id = getProductId(item);
              const discount =
                product.discount ||
                (product.mrp && product.price
                  ? Math.round(
                      ((product.mrp - product.price) / product.mrp) * 100,
                    )
                  : 0);
              const mrp = product.mrp || 0;
              const price = product.sellingPrice || product.price || 0;
              const imgUrl =
                product.images?.[0]?.url ||
                "https://placehold.co/300x300/e2e8f0/94a3b8?text=N/A";

              return (
                <div key={id} className="wishlist-card">
                  <Link to={`/product/${id}`} className="wishlist-card-img">
                    <img src={imgUrl} alt={product.name} />
                    {discount > 0 && (
                      <span className="wishlist-discount">{discount}% OFF</span>
                    )}
                  </Link>
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => handleRemove(id)}
                    title="Remove"
                  >
                    <FaTrash />
                  </button>
                  <div className="wishlist-card-info">
                    {product.brand && (
                      <span className="wishlist-brand">{product.brand}</span>
                    )}
                    <Link to={`/product/${id}`} className="wishlist-name">
                      {product.name}
                    </Link>
                    <div className="wishlist-price">
                      <span className="wishlist-current">
                        <FaRupeeSign />
                        {price.toLocaleString("en-IN")}
                      </span>
                      {mrp > price && (
                        <span className="wishlist-mrp">
                          <FaRupeeSign />
                          {mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <button
                      className="wishlist-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <FaShoppingCart /> Move to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
