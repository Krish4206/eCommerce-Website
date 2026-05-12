import { useState, useEffect } from "react";

// Simple global wishlist count (no Redux needed)
let wishlistListeners = [];
let wishlistCount = 0;

export const updateWishlistCount = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("sanjish_wishlist") || "[]");
    wishlistCount = stored.length;
  } catch {
    wishlistCount = 0;
  }
  wishlistListeners.forEach((fn) => fn(wishlistCount));
};

export const useWishlistCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    updateWishlistCount();
    const listener = (val) => setCount(val);
    wishlistListeners.push(listener);
    return () => {
      wishlistListeners = wishlistListeners.filter((l) => l !== listener);
    };
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handler = () => updateWishlistCount();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return count;
};
