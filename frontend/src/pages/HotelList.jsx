
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchHotels,
  deleteHotel,
} from "../redux/hotelSlice";

import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";

const HotelList = () => {
  const dispatch = useDispatch();

  const {
    hotels = [],
    total = 0,
    limit = 6,
    loading,
    error,
  } = useSelector((state) => state.hotels);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");

  const currentLimit = Number(limit) || 6;

  const totalPages = Math.ceil(
    Number(total || 0) / currentLimit
  );

  useEffect(() => {
    dispatch(
      fetchHotels({
        title: search,
        minPrice,
        maxPrice,
        offset: (page - 1) * currentLimit,
        limit: currentLimit,
      })
    );
  }, [
    dispatch,
    search,
    minPrice,
    maxPrice,
    page,
    currentLimit,
  ]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCategory("all");
    setPage(1);
  };

  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  const handleRelatedSearch = (type) => {
    setCategory(type);
    setSearch("");
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("all");
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );

    if (!confirmDelete) return;

    const result = await dispatch(deleteHotel(id));

    if (deleteHotel.fulfilled.match(result)) {
      alert("Hotel deleted successfully");

      dispatch(
        fetchHotels({
          title: search,
          minPrice,
          maxPrice,
          offset: (page - 1) * currentLimit,
          limit: currentLimit,
        })
      );
    }
  };

  const categoryKeywords = {
    luxury: [
      "luxury",
      "premium",
      "palace",
      "grand",
      "royal",
      "five star",
      "5 star",
    ],

    resort: [
      "resort",
      "beach",
      "retreat",
      "holiday resort",
    ],

    city: [
      "city",
      "urban",
      "downtown",
      "central",
    ],

    budget: [
      "budget",
      "affordable",
      "economy",
      "cheap",
      "value",
    ],
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (category === "all") {
      return true;
    }

    const text = `
      ${hotel.title || ""}
      ${hotel.description || ""}
    `.toLowerCase();

    return categoryKeywords[category].some((keyword) =>
      text.includes(keyword)
    );
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sort === "price-low") {
      return Number(a.price) - Number(b.price);
    }

    if (sort === "price-high") {
      return Number(b.price) - Number(a.price);
    }

    if (sort === "name") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  const categoryName = {
    all: "All Hotels",
    luxury: "Luxury Hotels",
    resort: "Resorts",
    city: "City Hotels",
    budget: "Budget Hotels",
  };

  return (
    <div className="hotel-app">

      <header className="main-header">

        <div className="site-logo">
          STAYSCAPE
        </div>

        <div className="header-search">

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search hotels by name..."
          />

          <button type="button">
            🔍
          </button>

        </div>

        <div className="header-links">

          <Link
            to="/add"
            className="header-add-btn"
          >
            + Add Hotel
          </Link>

        </div>

      </header>


      <div className="hotel-banner">

        <div className="banner-content">

          <h1>
            Find Your Perfect Stay
          </h1>

          <div className="breadcrumbs">
            Home
            <span>›</span>
            Hotels
          </div>

        </div>

      </div>


      <main className="hotel-page">

        <div className="hotel-layout">

          <aside className="filter-sidebar">

            <div className="filter-box">

              <div className="filter-title">
                Related Items
              </div>

              <div className="filter-list">

                <button
                  type="button"
                  onClick={() =>
                    handleRelatedSearch("all")
                  }
                  className={
                    category === "all"
                      ? "related-item active"
                      : "related-item"
                  }
                >
                  All Hotels
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleRelatedSearch("luxury")
                  }
                  className={
                    category === "luxury"
                      ? "related-item active"
                      : "related-item"
                  }
                >
                  Luxury Hotels
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleRelatedSearch("resort")
                  }
                  className={
                    category === "resort"
                      ? "related-item active"
                      : "related-item"
                  }
                >
                  Resorts
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleRelatedSearch("city")
                  }
                  className={
                    category === "city"
                      ? "related-item active"
                      : "related-item"
                  }
                >
                  City Hotels
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleRelatedSearch("budget")
                  }
                  className={
                    category === "budget"
                      ? "related-item active"
                      : "related-item"
                  }
                >
                  Budget Hotels
                </button>

              </div>

            </div>


            <div className="filter-box">

              <div className="filter-title">
                Search
              </div>

              <input
                type="text"
                className="sidebar-input"
                value={search}
                onChange={handleSearch}
                placeholder="Search hotel"
              />

            </div>


            <div className="filter-box">

              <div className="filter-title">
                Price Range
              </div>

              <div className="price-filter">

                <input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPrice}
                  placeholder="Min"
                  min="0"
                />

                <span>
                  to
                </span>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPrice}
                  placeholder="Max"
                  min="0"
                />

              </div>

            </div>


            {(search ||
              minPrice ||
              maxPrice ||
              category !== "all") && (

              <button
                type="button"
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            )}

          </aside>


          <section className="hotel-content">

            <div className="hotel-content-top">

              <div>

                <div className="hotel-count">

                  {category === "all"
                    ? `${total} Hotels Found`
                    : `${filteredHotels.length} ${categoryName[category]} Found`}

                </div>


                {(search ||
                  minPrice ||
                  maxPrice ||
                  category !== "all") && (

                  <div className="active-filter-text">

                    {category !== "all"
                      ? `Showing ${categoryName[category]}`
                      : "Showing filtered results"}

                  </div>

                )}

              </div>


              <div className="hotel-sort">

                <label>
                  Sort by
                </label>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                >

                  <option value="default">
                    Best Match
                  </option>

                  <option value="name">
                    Hotel Name
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                </select>

              </div>

            </div>


            {loading && (

              <div className="list-message">
                Loading hotels...
              </div>

            )}


            {!loading && error && (

              <div className="list-message error-message">
                {error}
              </div>

            )}


            {!loading &&
              !error &&
              sortedHotels.length === 0 && (

                <div className="list-message">

                  No {category === "all"
                    ? "hotels"
                    : categoryName[category].toLowerCase()} found.

                </div>

              )}


            {!loading &&
              !error &&
              sortedHotels.length > 0 && (

                <div className="hotel-list">

                  {sortedHotels.map((hotel) => (

                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onDelete={handleDelete}
                    />

                  ))}

                </div>

              )}


            {category === "all" &&
              totalPages > 1 && (

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />

              )}

          </section>

        </div>

      </main>


      <footer className="site-footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-logo">
              STAYSCAPE
            </div>

            <div className="footer-copy">
              © 2026 StayScape
            </div>

          </div>


          <div className="footer-column">

            <h4>
              STORE
            </h4>

            <span>
              About us
            </span>

            <span>
              Hotels
            </span>

            <span>
              Destinations
            </span>

          </div>


          <div className="footer-column">

            <h4>
              INFORMATION
            </h4>

            <span>
              Help center
            </span>

            <span>
              Hotel details
            </span>

            <span>
              Booking information
            </span>

          </div>


          <div className="footer-column">

            <h4>
              SUPPORT
            </h4>

            <span>
              Contact us
            </span>

            <span>
              Documents
            </span>

            <span>
              Customer support
            </span>

          </div>


          <div className="footer-column">

            <h4>
              NEWSLETTER
            </h4>

            <span>
              Stay updated with latest hotels
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default HotelList;
