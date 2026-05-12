import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrders } from "../store/slices/orderSlice";
import {
  FaBox,
  FaClock,
  FaMapMarkerAlt,
  FaCog,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";
import { showToast } from "../components/ToastNotification";
import { authService } from "../services";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [activeSection, setActiveSection] = useState("orders");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#6366f1",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status?.toLowerCase()] || "#64748b";
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      showToast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to change password";
      setPasswordError(message);
      showToast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const sidemenu = [
    { id: "orders", label: "My Orders", icon: <FaShoppingBag /> },
    { id: "addresses", label: "My Addresses", icon: <FaMapMarkerAlt /> },
    { id: "settings", label: "Account Settings", icon: <FaCog /> },
    { id: "password", label: "Change Password", icon: <FaKey /> },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card user-card">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h3>{user?.name || "User"}</h3>
            <p className="user-email">{user?.email}</p>
          </div>

          <nav className="profile-nav">
            {sidemenu.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {/* My Orders */}
          {activeSection === "orders" && (
            <div className="profile-card">
              <div className="section-header">
                <FaShoppingBag className="section-icon" />
                <h2>My Orders</h2>
              </div>

              {isLoading ? (
                <div className="section-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading your orders...</p>
                </div>
              ) : orders?.length === 0 ? (
                <div className="section-empty">
                  <FaBox className="empty-icon" />
                  <h3>No orders yet</h3>
                  <p>
                    You haven't placed any orders yet. Start exploring our
                    collection!
                  </p>
                  <Link to="/products" className="action-btn-primary">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders?.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-top">
                        <div className="order-meta">
                          <span className="order-id">
                            Order #{order._id?.slice(-8)}
                          </span>
                          <span className="order-date">
                            <FaClock />{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                        <span
                          className="order-status"
                          style={{
                            backgroundColor: getStatusColor(order.orderStatus || order.status),
                          }}
                        >
                          {order.orderStatus || order.status}
                        </span>
                      </div>
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <img
                            src={
                              item.product?.images?.[0]?.url ||
                              "https://placehold.co/60x60/e2e8f0/94a3b8?text=N/A"
                            }
                            alt={item.product?.name}
                          />
                          <div className="order-item-info">
                            <h4>{item.product?.name}</h4>
                            <p>
                              Qty: {item.quantity} × ₹
                              {item.price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="order-total">
                        Total:{" "}
                        <strong>
                          ₹{(order.totalAmount || order.totalPrice)?.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Addresses */}
          {activeSection === "addresses" && (
            <div className="profile-card">
              <div className="section-header">
                <FaMapMarkerAlt className="section-icon" />
                <h2>My Addresses</h2>
              </div>

              <div className="section-empty">
                <FaMapMarkerAlt className="empty-icon" />
                <h3>No addresses saved</h3>
                <p>Add your delivery addresses for faster checkout.</p>
                <button className="action-btn-primary">
                  + Add New Address
                </button>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeSection === "settings" && (
            <div className="profile-card">
              <div className="section-header">
                <FaCog className="section-icon" />
                <h2>Account Settings</h2>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="form-input"
                  />
                </div>
                <button className="form-submit-btn">Update Profile</button>
              </div>
            </div>
          )}

          {/* Change Password */}
          {activeSection === "password" && (
            <div className="profile-card">
              <div className="section-header">
                <FaKey className="section-icon" />
                <h2>Change Password</h2>
              </div>

              {passwordError && (
                <div className="form-error">{passwordError}</div>
              )}

              <form className="form-section" onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-field">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-field">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Min 6 characters"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-field">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Re-enter new password"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="toggle-pw"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
