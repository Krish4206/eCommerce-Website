import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services';

// Get cart from localStorage
const getLocalCart = () => {
  try {
    const cart = localStorage.getItem('ecommerce_cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getLocalCart(),
  isLoading: false,
  error: null,
  totalItems: getLocalCart().reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: getLocalCart().reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
};

// Save cart to localStorage
const saveLocalCart = (items) => {
  localStorage.setItem('ecommerce_cart', JSON.stringify(items));
};

const normalizeCartPayload = (payload) => {
  const cart = payload?.cart || payload;
  const items = cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = typeof cart.totalPrice === 'number'
    ? cart.totalPrice
    : items.reduce(
        (sum, item) => sum + ((item.price || item.product?.price || 0) * (item.quantity || 0)),
        0,
      );

  return { items, totalItems, totalPrice };
};

// Get cart (from API if logged in, else localStorage)
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      if (auth.isAuthenticated) {
        const { data } = await cartService.getCart();
        return normalizeCartPayload(data.data);
      }
      // Return local cart for unauthenticated users
      const localCart = getLocalCart();
      return {
        items: localCart,
        totalItems: localCart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        totalPrice: localCart.reduce((sum, item) => sum + ((item.price || item.product?.price || 0) * (item.quantity || 0)), 0)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, productId, quantity = 1 }, { rejectWithValue, getState, dispatch }) => {
    const { auth } = getState();
    
    try {
      // If productId is provided, we need to fetch the product first
      let productData = product;
      if (productId && !product) {
        // Fetch product data
        const { productService } = await import('../../services');
        const { data } = await productService.getById(productId);
        productData = data.data.product;
      }
      
      if (auth.isAuthenticated) {
        const { data } = await cartService.addToCart(productData._id, quantity);
        return normalizeCartPayload(data.data);
      }
      
      // Local cart for unauthenticated users
      const localCart = getLocalCart();
      const existingIndex = localCart.findIndex(item => 
        (item.product?._id || item.product?.id) === productData._id
      );
      
      if (existingIndex >= 0) {
        localCart[existingIndex].quantity += quantity;
      } else {
        localCart.push({
          product: productData,
          quantity,
          price: productData.price
        });
      }
      
      saveLocalCart(localCart);
      return { 
        items: localCart, 
        totalItems: localCart.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: localCart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    
    try {
      if (auth.isAuthenticated) {
        const { data } = await cartService.updateCartItem(itemId, quantity);
        return normalizeCartPayload(data.data);
      }
      
      // Local cart update
      const localCart = getLocalCart();
      const updatedCart = localCart.map(item => {
        const id = item._id || item.id || item.product?._id;
        if (id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      saveLocalCart(updatedCart);
      return { 
        items: updatedCart, 
        totalItems: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedCart.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue, getState }) => {
    const { auth } = getState();
    
    try {
      if (auth.isAuthenticated) {
        const { data } = await cartService.removeFromCart(itemId);
        return normalizeCartPayload(data.data);
      }
      
      // Local cart remove
      const localCart = getLocalCart();
      const updatedCart = localCart.filter(item => {
        const id = item._id || item.id || item.product?._id;
        return id !== itemId;
      });
      
      saveLocalCart(updatedCart);
      return { 
        items: updatedCart, 
        totalItems: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedCart.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    
    try {
      if (auth.isAuthenticated) {
        await cartService.clearCart();
      }
      
      // Clear local cart
      saveLocalCart([]);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Sync cart from localStorage on page load
    syncCartFromLocal: (state, action) => {
      const localCart = action.payload;
      if (localCart && Array.isArray(localCart)) {
        state.items = localCart;
        state.totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = localCart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
      }
    },
    clearCartError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.totalItems = action.payload?.totalItems || 0;
        state.totalPrice = action.payload?.totalPrice || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.items || [];
        state.totalItems = action.payload?.totalItems || 0;
        state.totalPrice = action.payload?.totalPrice || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload?.items) {
          state.items = action.payload.items;
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
        }
      })
      // Remove From Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload?.items) {
          state.items = action.payload.items;
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
        } else {
          // For API response, filter by itemId
          state.items = state.items.filter(item => 
            (item._id || item.id || item.product?._id) !== action.payload
          );
          state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
          state.totalPrice = state.items.reduce((sum, item) => 
            sum + ((item.price || item.product?.price || 0) * (item.quantity || 1)), 0);
        }
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  }
});

export const { syncCartFromLocal, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
