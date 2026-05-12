import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import FilterSidebar from "../components/FilterSidebar";
import ProductCardEnhanced from "../components/ProductCardEnhanced";
import "./ProductsPageEnhanced.css";
import { toast } from "react-toastify";

const ProductsPageEnhanced = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [viewType, setViewType] = useState("grid");

  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    brands: [],
    priceRange: [0, 50000],
    discount: false,
    rating: null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        sortBy,
        search: filters.search,
        category: filters.category,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        onlySale: filters.discount,
        rating: filters.rating || "",
      });

      if (filters.brands.length > 0) {
        filters.brands.forEach((brand) => params.append("brand", brand));
      }

      const response = await axios.get(`/api/v1/products?${params}`);
      setProducts(response.data.data.products);
      setPagination({
        currentPage: response.data.data.pagination.page,
        totalPages: response.data.data.pagination.pages,
        total: response.data.data.pagination.total,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePriceChange = (range) => {
    handleFilterChange({
      ...filters,
      priceRange: range,
    });
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
    // Add logic to update cart in Redux
  };

  const handleAddToWishlist = (productId) => {
    toast.success("Added to wishlist!");
    // Add logic to update wishlist
  };

  const handleRemoveFromWishlist = (productId) => {
    toast.info("Removed from wishlist");
    // Add logic to update wishlist
  };

  return (
    <div className="products-page-enhanced">
      {/* Header with Search and Sort */}
      <div className="products-header">
        <div className="products-header-content">
          <h1>SHOP PRODUCTS</h1>
          <div className="results-info">
            Showing {products.length} of {pagination.total} products
          </div>
        </div>

        <div className="header-controls">
          {/* Sort Dropdown */}
          <div className="control-group">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPagination({ ...pagination, currentPage: 1 });
              }}
              className="sort-select"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popularity">Most Popular</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          {/* View Type Toggle */}
          <div className="control-group">
            <label>View:</label>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewType === "grid" ? "active" : ""}`}
                onClick={() => setViewType("grid")}
                title="Grid View"
              >
                ⊞⊞
              </button>
              <button
                className={`view-btn ${viewType === "list" ? "active" : ""}`}
                onClick={() => setViewType("list")}
                title="List View"
              >
                ≡≡
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="products-container">
        {/* Filters Sidebar */}
        <aside className="filters-aside">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            brands={[
              "Nike",
              "Adidas",
              "Puma",
              "Reebok",
              "Converse",
              "Skechers",
            ]}
            categories={[
              "Men",
              "Women",
              "Kids",
              "Home & Living",
              "Accessories",
              "Footwear",
            ]}
          />
        </aside>

        {/* Products Grid/List */}
        <main className="products-main">
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={`products-${viewType}`}>
                {products.map((product) => (
                  <ProductCardEnhanced
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    isInWishlist={false}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        currentPage: Math.max(1, pagination.currentPage - 1),
                      })
                    }
                    disabled={pagination.currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setPagination({ ...pagination, currentPage: page })
                      }
                      className={`pagination-btn ${pagination.currentPage === page ? "active" : ""}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        currentPage: Math.min(
                          pagination.totalPages,
                          pagination.currentPage + 1,
                        ),
                      })
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🛍</div>
              <h2>No Products Found</h2>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPageEnhanced;
