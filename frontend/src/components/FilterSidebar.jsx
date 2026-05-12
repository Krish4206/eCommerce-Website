import React from "react";
import { useState } from "react";
import "./FilterSidebar.css";

const FilterSidebar = ({
  onFilterChange,
  brands = [],
  categories = [],
  priceRange = [0, 10000],
  onPriceChange,
}) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceFilter, setPriceFilter] = useState(priceRange);
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleBrandChange = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    onFilterChange({
      brands: updated,
      category: selectedCategory,
      priceRange: priceFilter,
      discount: showDiscountOnly,
      rating: selectedRating,
    });
  };

  const handleCategoryChange = (cat) => {
    const updated = selectedCategory === cat ? null : cat;
    setSelectedCategory(updated);
    onFilterChange({
      brands: selectedBrands,
      category: updated,
      priceRange: priceFilter,
      discount: showDiscountOnly,
      rating: selectedRating,
    });
  };

  const handlePriceChange = (e) => {
    const value = [0, Number(e.target.value)];
    setPriceFilter(value);
    onPriceChange(value);
  };

  const handleDiscountToggle = () => {
    const updated = !showDiscountOnly;
    setShowDiscountOnly(updated);
    onFilterChange({
      brands: selectedBrands,
      category: selectedCategory,
      priceRange: priceFilter,
      discount: updated,
      rating: selectedRating,
    });
  };

  const handleRatingChange = (rating) => {
    const updated = selectedRating === rating ? null : rating;
    setSelectedRating(updated);
    onFilterChange({
      brands: selectedBrands,
      category: selectedCategory,
      priceRange: priceFilter,
      discount: showDiscountOnly,
      rating: updated,
    });
  };

  return (
    <div className="filter-sidebar">
      <h3>FILTERS</h3>

      {/* Price Filter */}
      <div className="filter-section">
        <h4>PRICE</h4>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="50000"
            value={priceFilter[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <div className="price-display">
            ₹{priceFilter[0]} - ₹{priceFilter[1]}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="filter-section">
          <h4>CATEGORY</h4>
          <div className="filter-options">
            {categories.map((cat) => (
              <label key={cat} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="filter-section">
          <h4>BRAND</h4>
          <div className="filter-options">
            {brands.slice(0, 5).map((brand) => (
              <label key={brand} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
            {brands.length > 5 && (
              <a href="#more" className="show-more">
                +{brands.length - 5} more
              </a>
            )}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div className="filter-section">
        <h4>RATING</h4>
        <div className="filter-options">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedRating === rating}
                onChange={() => handleRatingChange(rating)}
              />
              <span>{"★".repeat(rating)} &up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="filter-section">
        <h4>DISCOUNT</h4>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showDiscountOnly}
            onChange={handleDiscountToggle}
          />
          <span>On Sale Only</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
