import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductById,
  clearCurrentProduct,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import {
  FaShoppingCart,
  FaHeart,
  FaShippingFast,
  FaUndo,
  FaShieldAlt,
  FaArrowLeft,
  FaBoxOpen,
  FaCheck,
  FaTruck,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaStar,
  FaStarHalf,
  FaMinus,
  FaPlus,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
} from "react-icons/fa";
import { showToast } from "../components/ToastNotification";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading } = useSelector(
    (state) => state.products,
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    dispatch(getProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }))
      .unwrap()
      .then(() => showToast.cart("Added to cart! 🎉"))
      .catch((err) => showToast.error(err || "Failed to add to cart"));
  };

  const getImages = () => {
    if (product?.images?.length > 0) {
      return product.images.map((img) => img.url || img);
    }
    if (product?.image) return [product.image];
    return ["https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image"];
  };

  const images = getImages();
  const discount =
    product?.discount ||
    (product?.mrp && product?.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0);
  const mrp = product?.mrp || product?.originalPrice || product?.price || 0;
  const sellingPrice = product?.sellingPrice || product?.price || 0;
  const ratings = product?.ratings || 0;
  const numReviews = product?.numReviews || 0;

  // Generate delivery estimate
  const today = new Date();
  const deliveryDay = new Date(today);
  deliveryDay.setDate(
    deliveryDay.getDate() + (product?.estimatedDelivery?.maxDays || 5),
  );
  const deliveryDateStr = deliveryDay.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(ratings);
    const hasHalf = ratings - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<FaStarHalf key={i} className="star-filled" />);
      } else {
        stars.push(<FaStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  const sizes = product?.sizes || ["S", "M", "L", "XL", "XXL"];
  const colors = product?.colors || [
    { name: "Black", code: "#1a1a2e" },
    { name: "White", code: "#f8f9fa" },
    { name: "Navy", code: "#1e3a5f" },
    { name: "Red", code: "#dc2626" },
  ];

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product?.name} on Sanjish!`;

    const shareUrls = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast.success("Link copied!"));
    } else {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
    setShowShareOptions(false);
  };

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-not-found">
          <FaBoxOpen />
          <h2>Product not found</h2>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products" className="back-link">
            <FaArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/products">Products</Link>
          <span className="separator">/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category}`}>
                {product.category}
              </Link>
              <span className="separator">/</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* Image Section - Premium Gallery */}
          <div className="product-image-section">
            <div className="main-image-container">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="main-image"
              />
              {discount > 0 && (
                <span className="discount-badge-main">{discount}% OFF</span>
              )}
              {product.isNewArrival && <span className="new-badge">NEW</span>}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="urgency-badge">Only {product.stock} left</span>
              )}
              {product.stock === 0 && (
                <span className="out-of-stock-badge">Out of Stock</span>
              )}

              {/* Share Button */}
              <div className="share-wrapper">
                <button
                  className="share-btn"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  title="Share"
                >
                  <FaShareAlt />
                </button>
                {showShareOptions && (
                  <div className="share-options">
                    <button onClick={() => handleShare("facebook")}>
                      <FaFacebook /> Facebook
                    </button>
                    <button onClick={() => handleShare("twitter")}>
                      <FaTwitter /> Twitter
                    </button>
                    <button onClick={() => handleShare("whatsapp")}>
                      <FaWhatsapp /> WhatsApp
                    </button>
                    <button onClick={() => handleShare("copy")}>
                      <FaCopy /> Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section - Conversion Optimized */}
          <div className="product-info-section">
            {/* Brand & Category */}
            <div className="product-meta">
              <span className="product-brand">
                {product.brand || "Sanjish"}
              </span>
              <span className="product-category">{product.category}</span>
            </div>

            <h1 className="product-name">{product.name}</h1>

            {/* Rating Row */}
            <div className="product-rating-section">
              <div className="stars">{renderStars()}</div>
              <span className="rating-text">
                {ratings.toFixed(1)} ({numReviews} Reviews)
              </span>
            </div>

            {/* Price Section - INR */}
            <div className="price-section">
              <span className="current-price">
                <FaRupeeSign />
                {sellingPrice.toLocaleString("en-IN")}
              </span>
              {mrp > sellingPrice && (
                <>
                  <span className="original-price">
                    <FaRupeeSign />
                    {mrp.toLocaleString("en-IN")}
                  </span>
                  <span className="discount">{discount}% OFF</span>
                </>
              )}
              {mrp > sellingPrice && (
                <div className="savings-badge">
                  You save <FaRupeeSign />
                  {(mrp - sellingPrice).toLocaleString("en-IN")}
                </div>
              )}
            </div>

            {/* Tax Info */}
            <p className="tax-info">inclusive of all taxes</p>

            {/* Color Selection */}
            {colors && colors.length > 0 && (
              <div className="variant-section">
                <h4>
                  Color: <span>{selectedColor || "Select"}</span>
                </h4>
                <div className="color-options">
                  {colors.map((color) => (
                    <button
                      key={color.name || color.code}
                      className={`color-swatch ${selectedColor === (color.name || color.code) ? "active" : ""}`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => setSelectedColor(color.name || color.code)}
                      title={color.name || color.code}
                    >
                      {selectedColor === (color.name || color.code) && (
                        <FaCheck />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes && sizes.length > 0 && (
              <div className="variant-section">
                <div className="variant-header">
                  <h4>
                    Size: <span>{selectedSize || "Select"}</span>
                  </h4>
                  <button className="size-guide-btn">📏 Size Guide</button>
                </div>
                <div className="size-options">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Estimate */}
            <div className="delivery-estimate">
              <FaTruck />
              <div>
                <span className="delivery-label">Delivery by</span>
                <span className="delivery-date">{deliveryDateStr}</span>
                {mrp >= 499 ? (
                  <span className="delivery-free">FREE</span>
                ) : (
                  <span className="delivery-charge">₹49 shipping</span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="stock-info">
              {product.stock > 10 ? (
                <span className="in-stock">
                  <FaCheck /> In Stock
                </span>
              ) : product.stock > 0 ? (
                <span className="low-stock">
                  ⚠️ Only {product.stock} items left!
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <h4>Quantity:</h4>
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQuantity(Math.min(product.stock || 99, quantity + 1))
                  }
                  disabled={quantity >= (product.stock || 99)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FaShoppingCart /> Add to Bag
              </button>
              <button
                className="wishlist-btn"
                onClick={() => showToast.wishlist("Added to Wishlist ❤️")}
              >
                <FaHeart /> Wishlist
              </button>
            </div>

            {/* Offers */}
            <div className="offers-section">
              <h4>Available Offers</h4>
              <div className="offer-item">
                <FaShippingFast />
                <span>
                  <strong>Free Delivery</strong> on orders above ₹499
                </span>
              </div>
              <div className="offer-item">
                <FaShieldAlt />
                <span>
                  <strong>Bank Offer</strong> 10% off on HDFC Credit Card
                </span>
              </div>
              <div className="offer-item">
                <FaUndo />
                <span>
                  <strong>Easy Returns</strong> 7-day return policy
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h4>Product Details</h4>
              <p>{product.description}</p>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
              <div className="feature-item">
                <FaShieldAlt />
                <div>
                  <h4>100% Original</h4>
                  <p>Authentic products</p>
                </div>
              </div>
              <div className="feature-item">
                <FaUndo />
                <div>
                  <h4>Easy Returns</h4>
                  <p>7-day return policy</p>
                </div>
              </div>
              <div className="feature-item">
                <FaShippingFast />
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders above ₹499</p>
                </div>
              </div>
              <div className="feature-item">
                <FaMapMarkerAlt />
                <div>
                  <h4>Track Order</h4>
                  <p>Real-time tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
