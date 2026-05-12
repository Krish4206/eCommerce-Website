import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaBox } from "react-icons/fa";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { currentOrder, orderPlaced } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!orderPlaced) {
      navigate("/");
    }
  }, [orderPlaced, navigate]);

  if (!orderPlaced || !currentOrder) {
    return null;
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className="order-message">
          Thank you for your order. We've sent a confirmation email to your
          registered email address.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order ID</span>
            <strong>#{currentOrder._id?.slice(-8).toUpperCase()}</strong>
          </div>
          <div className="detail-row">
            <span>Order Date</span>
            <strong>
              {new Date(currentOrder.createdAt).toLocaleDateString()}
            </strong>
          </div>
          <div className="detail-row">
            <span>Total Amount</span>
            <strong>
              ₹
              {(currentOrder.totalAmount || currentOrder.totalPrice)?.toFixed(
                2,
              )}
            </strong>
          </div>
          <div className="detail-row">
            <span>Payment Method</span>
            <strong>
              {currentOrder.paymentInfo.method === "cod"
                ? "Cash on Delivery"
                : "Card"}
            </strong>
          </div>
        </div>

        <div className="order-items">
          <h3>Order Items</h3>
          {currentOrder.items?.map((item, index) => (
            <div key={index} className="item">
              <img
                src={
                  item.product?.images?.[0]?.url ||
                  "https://via.placeholder.com/60"
                }
                alt={item.product?.name}
              />

              <div className="item-details">
                <h4>{item.product?.name}</h4>
                <p>
                  Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                </p>
              </div>
              <span className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="shipping-address">
          <h3>Shipping Address</h3>
          <p>
            {currentOrder.shippingAddress?.name ||
              `${currentOrder.shippingAddress?.firstName || ""} ${currentOrder.shippingAddress?.lastName || ""}`.trim()}
            <br />
            {currentOrder.shippingAddress?.street ||
              currentOrder.shippingAddress?.address}
            <br />
            {currentOrder.shippingAddress?.city},{" "}
            {currentOrder.shippingAddress?.state}{" "}
            {currentOrder.shippingAddress?.zipCode}
            <br />
            {currentOrder.shippingAddress?.country}
          </p>
        </div>

        <div className="confirmation-actions">
          <Link to="/profile" className="view-orders-btn">
            <FaBox /> View My Orders
          </Link>
          <Link to="/products" className="continue-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
