// Premium Toast Notification System — Sanjish
// Like Myntra/Flipkart level popups

import { useEffect, useState, useRef } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaHeart,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";

const TOAST_TYPES = {
  success: {
    icon: <FaCheckCircle />,
    gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    borderColor: "#22c55e",
    iconColor: "#16a34a",
    shadow: "0 8px 32px rgba(22, 163, 74, 0.15)",
    label: "Success",
  },
  error: {
    icon: <FaTimesCircle />,
    gradient: "linear-gradient(135deg, #fef2f2, #fee2e2)",
    borderColor: "#ef4444",
    iconColor: "#dc2626",
    shadow: "0 8px 32px rgba(239, 68, 68, 0.15)",
    label: "Error",
  },
  info: {
    icon: <FaInfoCircle />,
    gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    borderColor: "#3b82f6",
    iconColor: "#2563eb",
    shadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
    label: "Info",
  },
  warning: {
    icon: <FaExclamationTriangle />,
    gradient: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    borderColor: "#f59e0b",
    iconColor: "#d97706",
    shadow: "0 8px 32px rgba(245, 158, 11, 0.15)",
    label: "Warning",
  },
  cart: {
    icon: <FaShoppingCart />,
    gradient: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    borderColor: "#ec4899",
    iconColor: "#db2777",
    shadow: "0 8px 32px rgba(236, 72, 153, 0.15)",
    label: "Cart",
  },
  wishlist: {
    icon: <FaHeart />,
    gradient: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
    borderColor: "#ff416c",
    iconColor: "#e63950",
    shadow: "0 8px 32px rgba(255, 65, 108, 0.15)",
    label: "Wishlist",
  },
};

let toastListeners = [];
let toastId = 0;

export const showToast = (message, type = "success", duration = 3000) => {
  const id = ++toastId;
  toastListeners.forEach((listener) =>
    listener({ id, message, type, duration }),
  );
  return id;
};

showToast.success = (msg, dur) => showToast(msg, "success", dur);
showToast.error = (msg, dur) => showToast(msg, "error", dur);
showToast.info = (msg, dur) => showToast(msg, "info", dur);
showToast.cart = (msg, dur) => showToast(msg, "cart", dur);
showToast.wishlist = (msg, dur) => showToast(msg, "wishlist", dur);

const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const startRef = useRef(Date.now());
  const removedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(pct);
      if (pct <= 0 && !removedRef.current) {
        clearInterval(interval);
        removedRef.current = true;
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    if (removedRef.current) return;
    removedRef.current = true;
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`toast-premium ${isExiting ? "toast-exit" : "toast-enter"}`}
      style={{
        background: config.gradient,
        borderLeft: `4px solid ${config.borderColor}`,
        boxShadow: config.shadow,
      }}
    >
      <div className="toast-premium-icon" style={{ color: config.iconColor }}>
        {config.icon}
      </div>
      <div className="toast-premium-content">
        <span className="toast-premium-message">{toast.message}</span>
      </div>
      <button className="toast-premium-close" onClick={handleClose}>
        <FaTimes />
      </button>
      <div
        className="toast-premium-progress"
        style={{ background: config.borderColor, width: `${progress}%` }}
      />
    </div>
  );
};

export const ToastContainerPremium = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (event) => setToasts((prev) => [...prev, event]);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-premium-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainerPremium;
