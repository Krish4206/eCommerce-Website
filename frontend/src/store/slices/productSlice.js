import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services";

const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    search: "",
    sort: "-createdAt",
  },
};

// Get all products
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productService.getAll(params);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productService.getFeatured();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
);

// Get product by ID
export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productService.getById(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

// Get categories
export const getCategories = createAsyncThunk(
  "products/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productService.getCategories();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.pages,
        };
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.products;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Product By ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload?.product || null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Categories
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  clearCurrentProduct,
  clearError,
} = productSlice.actions;
export default productSlice.reducer;
