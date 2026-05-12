// Sanjish Admin Panel — Manage Products, Orders, Analytics
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaRupeeSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaClipboardList,
  FaSignOutAlt,
  FaSearch,
  FaImage,
  FaSave,
} from "react-icons/fa";
import { showToast } from "../components/ToastNotification";
import api from "../services/api";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    mrp: "",
    price: "",
    brand: "",
    category: "Men",
    stock: "",
    sizes: "S,M,L,XL",
    colors: '[{"name":"Black","code":"#000"}]',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes, statsRes] = await Promise.all([
        api.get("/products?limit=50"),
        api.get("/admin/analytics"),
        api.get("/admin/analytics/sales-dashboard"),
      ]);
      setProducts(prodRes.data.data.products || []);
      setOrders(orderRes.data.data?.orders || []);
      setStats(statsRes.data.data?.totalStats?.[0] || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products?limit=100");
      setProducts(res.data.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data?.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        mrp: Number(newProduct.mrp),
        price: Number(newProduct.price),
        sellingPrice: Number(newProduct.price),
        brand: newProduct.brand,
        category: newProduct.category,
        stock: Number(newProduct.stock),
        sizes: newProduct.sizes.split(",").map((s) => s.trim()),
        colors: JSON.parse(newProduct.colors),
        isNewArrival: true,
      };
      await api.post("/products", payload);
      showToast.success("Product added successfully!");
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        description: "",
        mrp: "",
        price: "",
        brand: "",
        category: "Men",
        stock: "",
        sizes: "S,M,L,XL",
        colors: '[{"name":"Black","code":"#000"}]',
      });
      loadProducts();
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      showToast.success("Product deleted");
      loadProducts();
    } catch {
      showToast.error("Failed to delete");
    }
  };

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-logo">Sanjish Admin</div>
        <nav className="admin-nav">
          {[
            { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
            { id: "products", label: "Products", icon: <FaBox /> },
            { id: "orders", label: "Orders", icon: <FaClipboardList /> },
          ].map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => {
                setTab(item.id);
                if (item.id === "products") loadProducts();
                if (item.id === "orders") loadOrders();
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button
          className="admin-logout"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="admin-content">
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card pink">
                <FaRupeeSign />
                <div>
                  <h3>₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="stat-card indigo">
                <FaShoppingBag />
                <div>
                  <h3>{stats?.totalOrders || 0}</h3>
                  <p>Orders</p>
                </div>
              </div>
              <div className="stat-card green">
                <FaBox />
                <div>
                  <h3>{products.length}</h3>
                  <p>Products</p>
                </div>
              </div>
              <div className="stat-card orange">
                <FaUsers />
                <div>
                  <h3>
                    {stats?.avgOrderValue
                      ? `₹${Math.round(stats.avgOrderValue).toLocaleString("en-IN")}`
                      : "—"}
                  </h3>
                  <p>Avg Order Value</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Products ({products.length})</h1>
              <button
                className="add-btn"
                onClick={() => setShowAddProduct(true)}
              >
                <FaPlus /> Add Product
              </button>
            </div>
            <div className="admin-table">
              <div className="table-header">
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Category</span>
                <span>Actions</span>
              </div>
              {products.map((p) => (
                <div key={p._id} className="table-row">
                  <div className="table-product">
                    <img
                      src={p.images?.[0]?.url || "https://placehold.co/40x40"}
                      alt=""
                    />
                    <span>{p.name}</span>
                  </div>
                  <span>
                    ₹{(p.price || p.sellingPrice || 0).toLocaleString("en-IN")}
                  </span>
                  <span>
                    <span
                      className={`stock-badge ${p.stock > 10 ? "in" : p.stock > 0 ? "low" : "out"}`}
                    >
                      {p.stock}
                    </span>
                  </span>
                  <span>{p.category}</span>
                  <span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(p._id)}
                    >
                      <FaTrash />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="admin-content">
            <h1>Orders ({orders.length})</h1>
            <div className="admin-table">
              <div className="table-header">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              {orders.map((o) => (
                <div key={o._id} className="table-row">
                  <span className="order-id-text">#{o._id?.slice(-8)}</span>
                  <span>{o.user?.name || "—"}</span>
                  <span>{o.items?.length || 0}</span>
                  <span>₹{(o.totalAmount || 0).toLocaleString("en-IN")}</span>
                  <span>
                    <span className={`status-badge ${o.orderStatus}`}>
                      {o.orderStatus}
                    </span>
                  </span>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="table-empty">No orders yet</div>
              )}
            </div>
          </div>
        )}

        {/* ADD PRODUCT MODAL */}
        {showAddProduct && (
          <div
            className="modal-overlay"
            onClick={() => setShowAddProduct(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>
                <FaPlus /> Add New Product
              </h2>
              <form onSubmit={handleAddProduct}>
                <div className="modal-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      required
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="e.g. Classic Polo T-Shirt"
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand *</label>
                    <input
                      required
                      value={newProduct.brand}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                      placeholder="e.g. Sanjish Originals"
                    />
                  </div>
                  <div className="form-group">
                    <label>MRP (₹) *</label>
                    <input
                      required
                      type="number"
                      value={newProduct.mrp}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, mrp: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input
                      required
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Kids</option>
                      <option>Home & Living</option>
                      <option>Accessories</option>
                      <option>Footwear</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      required
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group full">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Sizes (comma separated)</label>
                    <input
                      value={newProduct.sizes}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sizes: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    <FaSave /> Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
