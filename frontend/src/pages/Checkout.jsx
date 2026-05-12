import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
import { createOrder as createOrderAction } from "../store/slices/orderSlice";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheck,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.orders);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, items.length, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fix: Use product._id safely with fallback
    const orderItems = items.map((item) => ({
      product: item.product?._id || item.product?.id || item._id,
      name: item.product?.name || item.name,
      price: item.product?.price || item.price,
      quantity: item.quantity || 1,
      image:
        item.product?.images?.[0]?.url || item.product?.image || item.image,
    }));

    const orderData = {
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      items: orderItems,
      totalPrice: totalPrice * 1.08,
    };

    dispatch(createOrderAction(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        navigate("/order-confirmation");
      })
      .catch((err) => toast.error(err || "Failed to place order"));
  };

  if (items.length === 0) {
    return null;
  }

  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + tax;

  const steps = [
    { id: 1, label: "Shipping", icon: <FaMapMarkerAlt /> },
    { id: 2, label: "Payment", icon: <FaCreditCard /> },
    { id: 3, label: "Review", icon: <FaCheck /> },
  ];

  // Use a unique key for each item (handle both API and local cart)
  const getItemKey = (item, index) => {
    return item.product?._id || item.product?.id || item._id || `item-${index}`;
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>
          <FaShoppingBag /> Checkout
        </h1>

        {/* Progress Steps */}
        <div className="checkout-steps">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="step-wrapper"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                className={`step ${currentStep === step.id ? "active" : ""} ${currentStep > step.id ? "completed" : ""}`}
              >
                <span className="step-number">
                  {currentStep > step.id ? <FaCheck /> : step.id}
                </span>
                <span className="step-label">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`step-connector ${currentStep > step.id ? "completed" : ""}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="checkout-content">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>
                <FaMapMarkerAlt /> Shipping Information
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <FaCreditCard /> Payment Method
              </h3>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <span className="option-icon">
                    <FaMoneyBillWave />
                  </span>
                  <span className="option-content">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive your order</p>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                  />
                  <span className="option-icon">
                    <FaCreditCard />
                  </span>
                  <span className="option-content">
                    <strong>Credit/Debit Card</strong>
                    <p>Pay securely with your card</p>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="loading-spinner"
                    style={{ width: 20, height: 20, borderWidth: 2 }}
                  />
                  Processing...
                </span>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  <FaTruck /> Place Order - ₹{grandTotal.toFixed(2)}
                </span>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>
              <FaShoppingBag /> Order Summary
            </h3>

            <div className="summary-items">
              {items.map((item, index) => {
                const product = item.product || item;
                const price = product?.price || 0;
                const quantity = item.quantity || 1;
                const imageUrl =
                  product?.images?.[0]?.url ||
                  product?.image ||
                  "https://placehold.co/60x60/e2e8f0/94a3b8?text=N/A";

                return (
                  <div key={getItemKey(item, index)} className="summary-item">
                    <img src={imageUrl} alt={product?.name || "Product"} />
                    <div className="item-info">
                      <h4>{product?.name || "Product"}</h4>
                      <p>Qty: {quantity}</p>
                    </div>
                    <span className="item-price-right">
                      ₹{(price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="badge badge-success">Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
