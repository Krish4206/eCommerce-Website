import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaArrowRight,
  FaTag,
  FaShieldAlt,
  FaTruck,
  FaBox,
  FaRupeeSign,
  FaCheck,
  FaUndo,
} from "react-icons/fa";
import { showToast } from "../components/ToastNotification";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const getProduct = (item) => item.product || item;
  const getItemId = (item) =>
    item._id || item.id || item.product?._id || item.product?.id;
  const getItemPrice = (item) =>
    item.product?.sellingPrice ||
    item.product?.price ||
    item.sellingPrice ||
    item.price ||
    0;
  const getItemMrp = (item) =>
    item.product?.mrp ||
    item.product?.originalPrice ||
    item.mrp ||
    item.originalPrice ||
    0;
  const getItemQuantity = (item) => item.quantity || 1;

  const handleQuantityChange = (item, change) => {
    const itemId = getItemId(item);
    const newQty = getItemQuantity(item) + change;
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (item) => {
    const itemId = getItemId(item);
    if (!itemId) {
      showToast.error("Unable to identify item");
      return;
    }
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => showToast.success("Item removed from cart"))
      .catch((err) => showToast.error(err || "Failed to remove item"));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      showToast.success("Cart cleared");
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "SANJISH10") {
      setCouponApplied(true);
      showToast.success("Coupon applied! 10% off 🎉");
    } else if (couponCode.trim().toUpperCase() === "FREEDEL") {
      setCouponApplied(true);
      showToast.success("Free delivery applied! 🚚");
    } else {
      showToast.error("Invalid coupon code");
    }
  };

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * getItemQuantity(item),
    0,
  );
  const totalMrp = items.reduce(
    (sum, item) => sum + getItemMrp(item) * getItemQuantity(item),
    0,
  );
  const totalDiscount = totalMrp - subtotal;
  const shipping = subtotal >= 499 ? 0 : 49;
  const couponDiscount =
    couponApplied && couponCode.toUpperCase() === "SANJISH10"
      ? subtotal * 0.1
      : 0;
  const grandTotal = subtotal + shipping - couponDiscount;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty-icon-wrapper">
              <FaShoppingBag />
            </div>
            <h2>Your cart feels lonely</h2>
            <p>
              Looks like you haven't added any items yet. Discover our amazing
              collection!
            </p>
            <Link to="/products" className="continue-shopping-btn">
              <FaBox /> Start Shopping <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header-section">
          <div className="cart-header-left">
            <div className="cart-header-icon">
              <FaShoppingBag />
            </div>
            <div>
              <h1>
                Shopping <span>Bag</span>
              </h1>
              <span className="cart-header-count">
                <strong>{totalItems}</strong>{" "}
                {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
          <button className="clear-cart-btn" onClick={handleClearCart}>
            <FaTrash /> Clear Bag
          </button>
        </div>

        <div className="cart-content">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {items.map((item) => {
              const product = getProduct(item);
              const itemId = getItemId(item);
              const price = getItemPrice(item);
              const mrp = getItemMrp(item);
              const quantity = getItemQuantity(item);
              const imageUrl =
                product?.images?.[0]?.url ||
                product?.image ||
                "https://placehold.co/100x100/e2e8f0/94a3b8?text=N/A";

              if (!itemId) return null;

              const itemDiscount =
                mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

              return (
                <div key={itemId} className="cart-item">
                  <div className="item-product">
                    <div className="item-image-wrapper">
                      <img src={imageUrl} alt={product?.name || "Product"} />
                    </div>
                    <div className="item-details">
                      <Link to={`/product/${product?._id || product?.id}`}>
                        <h3>{product?.name || "Unknown Product"}</h3>
                      </Link>
                      {product?.brand && (
                        <span className="item-brand">{product.brand}</span>
                      )}
                      {itemDiscount > 0 && (
                        <span className="item-discount">
                          {itemDiscount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="item-price">
                    <span className="current">
                      <FaRupeeSign />
                      {price.toLocaleString("en-IN")}
                    </span>
                    {mrp > price && (
                      <span className="original">
                        <FaRupeeSign />
                        {mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="item-quantity">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="item-total">
                    <FaRupeeSign />
                    {(price * quantity).toLocaleString("en-IN")}
                  </div>

                  <button
                    className="item-remove"
                    onClick={() => handleRemove(item)}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-header">
              <div className="summary-header-icon">
                <FaTag />
              </div>
              <h3>Order Summary</h3>
            </div>

            {/* Subtotal Breakdown */}
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-row-label">Bag MRP</span>
                <span className="summary-row-value">
                  <FaRupeeSign />
                  {totalMrp.toLocaleString("en-IN")}
                </span>
              </div>

              {totalDiscount > 0 && (
                <div className="summary-row discount">
                  <span className="summary-row-label">Bag Discount</span>
                  <span className="summary-row-value">
                    -<FaRupeeSign />
                    {totalDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-row-label">
                  <FaTruck /> Shipping
                </span>
                {shipping === 0 ? (
                  <span className="free-shipping-badge">
                    <FaCheck /> FREE
                  </span>
                ) : (
                  <span className="summary-row-value">
                    <FaRupeeSign />
                    {shipping}
                  </span>
                )}
              </div>

              {couponDiscount > 0 && (
                <div className="summary-row discount">
                  <span className="summary-row-label">
                    <FaTag /> Coupon Discount
                  </span>
                  <span className="summary-row-value">
                    -<FaRupeeSign />
                    {couponDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="promo-section">
              <label>
                <FaTag /> Have a promo code?
              </label>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g. SANJISH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                />
                <button
                  className="promo-apply-btn"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponCode.trim()}
                >
                  {couponApplied ? <FaCheck /> : "Apply"}
                </button>
              </div>
              {couponApplied && (
                <span className="coupon-applied">
                  Coupon applied successfully!
                </span>
              )}
            </div>

            {/* Free Delivery Progress */}
            {shipping > 0 && (
              <div className="free-delivery-progress">
                <FaTruck />
                <span>
                  Add items worth{" "}
                  <strong>
                    <FaRupeeSign />
                    {(499 - subtotal).toLocaleString("en-IN")}
                  </strong>{" "}
                  more for FREE delivery!
                </span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span className="summary-row-label">Total Amount</span>
              <span className="summary-row-value total-amount">
                <FaRupeeSign />
                {grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="savings-text">
              {totalDiscount > 0 &&
                `You save ₹${totalDiscount.toLocaleString("en-IN")} on this order! 🎉`}
            </p>

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout <FaArrowRight />
            </Link>

            <Link to="/products" className="continue-shopping-link">
              <FaArrowRight style={{ transform: "rotate(180deg)" }} /> Continue
              Shopping
            </Link>

            {/* Trust Badges */}
            <div className="summary-trust">
              <div className="trust-item">
                <FaShieldAlt /> Secure Checkout
              </div>
              <div className="trust-item">
                <FaUndo /> 7-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
