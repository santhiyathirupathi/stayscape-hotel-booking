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

  const sortedHotels = [...hotels].sort((a, b) => {
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

  return (
    <div className="hotel-app">

      {/* HEADER */}

      <header className="main-header">

        <div className="site-logo">
          STAYSCAPE
        </div>

        <div className="header-search">

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search hotels"
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

      {/* BLUE BANNER */}

      <div className="hotel-banner">

        <div className="banner-content">

          <h1>Hotels</h1>

          <div className="breadcrumbs">
            Home
            <span>›</span>
            Hotels
          </div>

        </div>

      </div>

      {/* MAIN */}

      <main className="hotel-page">

        <div className="hotel-layout">

          {/* FILTER SIDEBAR */}

          <aside className="filter-sidebar">

            <div className="filter-box">

              <div className="filter-title">
                Related Items
              </div>

              <div className="filter-list">

                <div>Hotels</div>
                <div>Luxury Hotels</div>
                <div>Resorts</div>
                <div>City Hotels</div>
                <div>Budget Hotels</div>

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
                Price
              </div>

              <div className="price-filter">

                <input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPrice}
                  placeholder="Min"
                  min="0"
                />

                <span>to</span>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPrice}
                  placeholder="Max"
                  min="0"
                />

              </div>

            </div>

          </aside>

          {/* CONTENT */}

          <section className="hotel-content">

            <div className="hotel-content-top">

              <div className="hotel-count">
                {total} Hotels Found
              </div>

              <div className="hotel-sort">

                <label>Sort by</label>

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
                  No hotels found.
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

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}

          </section>

        </div>

      </main>

      {/* FOOTER */}

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
            <h4>STORE</h4>
            <span>About us</span>
            <span>Hotels</span>
            <span>Destinations</span>
          </div>

          <div className="footer-column">
            <h4>INFORMATION</h4>
            <span>Help center</span>
            <span>Hotel details</span>
            <span>Booking information</span>
          </div>

          <div className="footer-column">
            <h4>SUPPORT</h4>
            <span>Contact us</span>
            <span>Documents</span>
            <span>Customer support</span>
          </div>

          <div className="footer-column">
            <h4>NEWSLETTER</h4>
            <span>Stay updated with latest hotels</span>
          </div>

        </div>

      </footer>

    </div>
  );
};

export default HotelList;