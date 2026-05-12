import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  getCategories,
  setPage,
} from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import {
  FaFilter,
  FaTimes,
  FaTh,
  FaList,
  FaSearch,
  FaBoxOpen,
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaRupeeSign,
} from "react-icons/fa";
import "./Products.css";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, isLoading, pagination } = useSelector(
    (state) => state.products,
  );
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = [
    localFilters.search,
    localFilters.category,
    localFilters.minPrice,
    localFilters.maxPrice,
  ].filter(Boolean).length;

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...localFilters,
        sortBy: localFilters.sort,
      }),
    );
  }, [dispatch, pagination.page, pagination.limit, localFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const apply = () => {
    dispatch(setPage(1));
    const p = new URLSearchParams();
    if (localFilters.search) p.set("search", localFilters.search);
    if (localFilters.category) p.set("category", localFilters.category);
    setSearchParams(p);
    setMobileOpen(false);
  };

  const clearAll = () => {
    setLocalFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    dispatch(setPage(1));
    setSearchParams({});
    setMobileOpen(false);
  };

  const removeTag = (key) => {
    setLocalFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const goPage = (p) => {
    dispatch(setPage(p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPages = () => {
    const pages = [];
    const t = pagination.totalPages;
    const c = pagination.page;
    if (t <= 5) {
      for (let i = 1; i <= t; i++) pages.push(i);
    } else {
      pages.push(1);
      if (c > 3) pages.push("...");
      for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) {
        if (i !== 1 && i !== t) pages.push(i);
      }
      if (c < t - 2) pages.push("...");
      if (t > 1) pages.push(t);
    }
    return pages;
  };

  const catCategories = categories.length
    ? categories.map((name) => ({ name, count: "—" }))
    : [
        { name: "Electronics", count: "250+" },
        { name: "Clothing", count: "500+" },
        { name: "Home & Garden", count: "180+" },
        { name: "Sports", count: "120+" },
        { name: "Books", count: "90+" },
        { name: "Beauty", count: "200+" },
      ];

  const FilterPanel = () => (
    <>
      {/* Header */}
      <div className="filters-header">
        <div className="filters-header-left">
          <div className="filter-icon-box">
            <FaFilter />
          </div>
          <h3>
            Filters
            {activeCount > 0 && (
              <span className="filter-badge">{activeCount}</span>
            )}
          </h3>
        </div>
        <button className="clear-all-btn" onClick={clearAll}>
          Clear
        </button>
      </div>

      {/* Search */}
      <div className="filter-block">
        <div className="filter-block-title">
          Search
          <FaChevronDown />
        </div>
        <div className="filter-search">
          <FaSearch className="filter-search-icon" />
          <input
            type="text"
            name="search"
            placeholder="What are you looking for?"
            value={localFilters.search}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Category */}
      <div className="filter-block">
        <div className="filter-block-title">
          Category
          <FaChevronDown />
        </div>
        <div className="category-options">
          <button
            className={`category-option ${!localFilters.category ? "active" : ""}`}
            onClick={() =>
              handleChange({ target: { name: "category", value: "" } })
            }
          >
            <span className="category-dot" />
            All Categories
            <span className="category-count">{pagination.total || "—"}</span>
          </button>
          {catCategories.map((cat) => (
            <button
              key={cat.name}
              className={`category-option ${localFilters.category === cat.name ? "active" : ""}`}
              onClick={() =>
                handleChange({ target: { name: "category", value: cat.name } })
              }
            >
              <span className="category-dot" />
              {cat.name}
              <span className="category-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="filter-block">
        <div className="filter-block-title">
          Price Range
          <FaChevronDown />
        </div>
        <div className="price-row">
          <div className="price-field">
            <FaRupeeSign />
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={handleChange}
            />
          </div>
          <span className="price-dash">—</span>
          <div className="price-field">
            <FaRupeeSign />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="price-bar">
          <div
            className="price-bar-fill"
            style={{
              left: localFilters.minPrice
                ? `${Math.min((localFilters.minPrice / 1000) * 100, 50)}%`
                : "0%",
              right: localFilters.maxPrice
                ? `${100 - Math.min((localFilters.maxPrice / 1000) * 100, 100)}%`
                : "0%",
            }}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="filter-block">
        <div className="filter-block-title">
          Sort By
          <FaChevronDown />
        </div>
        <div className="filter-select-wrap">
          <select name="sort" value={localFilters.sort} onChange={handleChange}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Active tags */}
      {activeCount > 0 && (
        <div className="active-tags">
          {localFilters.search && (
            <span className="active-tag">
              “{localFilters.search}”
              <button onClick={() => removeTag("search")}>
                <FaTimes />
              </button>
            </span>
          )}
          {localFilters.category && (
            <span className="active-tag">
              {localFilters.category}
              <button onClick={() => removeTag("category")}>
                <FaTimes />
              </button>
            </span>
          )}
          {(localFilters.minPrice || localFilters.maxPrice) && (
            <span className="active-tag">
              ₹{localFilters.minPrice || "0"}–₹{localFilters.maxPrice || "∞"}
              <button
                onClick={() => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    minPrice: "",
                    maxPrice: "",
                  }));
                }}
              >
                <FaTimes />
              </button>
            </span>
          )}
        </div>
      )}

      <button className="apply-btn" onClick={apply}>
        {activeCount > 0 ? `Apply (${activeCount})` : "Show Results"}
        <FaArrowRight />
      </button>
    </>
  );

  return (
    <div className="products-page">
      <div className="products-container">
        <aside className="filters-sidebar">
          <FilterPanel />
        </aside>

        <main className="products-main">
          <div className="products-header">
            <div className="products-header-left">
              <button
                className="mobile-filter-trigger"
                onClick={() => setMobileOpen(true)}
              >
                <FaFilter />
                {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
              </button>
              <h1>All Products</h1>
              <span className="result-badge">
                {products?.length || 0} / {pagination.total}
              </span>
            </div>

            <div className="header-right">
              <div className="view-switch">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <FaTh />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
              <p>Loading products…</p>
            </div>
          ) : products?.length === 0 ? (
            <div className="empty-state">
              <FaBoxOpen />
              <h3>Nothing found</h3>
              <p>Try adjusting your filters</p>
              <button
                className="apply-btn"
                style={{ margin: "0 auto" }}
                onClick={clearAll}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid" ? "products-grid" : "products-list-view"
              }
            >
              {products?.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pg-btn"
                disabled={pagination.page === 1}
                onClick={() => goPage(pagination.page - 1)}
              >
                <FaArrowLeft /> Prev
              </button>
              <div className="page-nums">
                {getPages().map((pg, i) =>
                  pg === "..." ? (
                    <span key={`d-${i}`} className="pg-dots">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pg}
                      className={`pg-num ${pagination.page === pg ? "active" : ""}`}
                      onClick={() => goPage(pg)}
                    >
                      {pg}
                    </button>
                  ),
                )}
              </div>
              <button
                className="pg-btn"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => goPage(pagination.page + 1)}
              >
                Next <FaArrowRight />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`drawer-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`drawer ${mobileOpen ? "open" : ""}`}>
        <div className="drawer-top">
          <h3>
            <FaFilter /> Filters
          </h3>
          <button className="drawer-close" onClick={() => setMobileOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <FilterPanel />
      </div>
    </div>
  );
};

export default Products;
