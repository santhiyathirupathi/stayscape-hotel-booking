import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_URL, getImageUrl, DEFAULT_HOTEL_IMAGE } from "../api";

const HotelDetails = () => {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hotel not found");
        }

        return response.json();
      })
      .then((data) => {
        setHotel(data);
        setLoading(false);
      })
      .catch(() => {
        setHotel(null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!hotel || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const hotelLat = Number(hotel.latitude);
        const hotelLng = Number(hotel.longitude);

        if (!isNaN(hotelLat) && !isNaN(hotelLng)) {
          const R = 6371; // km
          const dLat = ((hotelLat - userLat) * Math.PI) / 180;
          const dLon = ((hotelLng - userLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLat * Math.PI) / 180) *
              Math.cos((hotelLat * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          setDistance((R * c).toFixed(1));
        }
      },
      () => {},
      { timeout: 8000 }
    );
  }, [hotel]);

  if (loading) {
    return (
      <div className="detail-page">
        <Helmet>
          <title>Loading Hotel... | StayScape</title>
        </Helmet>
        <div className="empty-state">
          <p>Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="detail-page">
        <Helmet>
          <title>Hotel Not Found | StayScape</title>
        </Helmet>
        <div className="empty-state">
          <p>Hotel not found.</p>

          <Link to="/" className="back-btn">
            ← Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(hotel.image);
  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);

  const mapUrl =
    !isNaN(latitude) && !isNaN(longitude)
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${
          longitude - 0.02
        }%2C${latitude - 0.02}%2C${
          longitude + 0.02
        }%2C${latitude + 0.02
        }&layer=mapnik&marker=${latitude}%2C${longitude}`
      : "";

  return (
    <div className="detail-page">
      <Helmet>
        <title>{`${hotel.title} - Hotel Details | StayScape`}</title>
        <meta
          name="description"
          content={
            hotel.description?.substring(0, 160) ||
            `Details, location, and pricing for ${hotel.title}`
          }
        />
      </Helmet>

      <div className="detail-container">
        <div className="detail-top-bar">
          <Link
            to="/"
            className="back-btn"
          >
            ← Back to Hotels
          </Link>
        </div>

        <img
          src={imageUrl}
          alt={`Exterior view of ${hotel.title}`}
          className="detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_HOTEL_IMAGE;
          }}
        />

        <div className="detail-content">
          <div className="detail-heading">
            <div>
              <span className="detail-label">
                HOTEL DETAILS
              </span>

              <h1>{hotel.title}</h1>
            </div>

            <div className="detail-price-box">
              <span>Price</span>

              <strong>
                ₹{Number(hotel.price).toLocaleString("en-IN")}
              </strong>

              <small>
                per night
              </small>
            </div>
          </div>

          <div className="detail-section">
            <h3>About this hotel</h3>

            <p className="detail-description">
              {hotel.description}
            </p>
          </div>

          <div className="detail-section">
            <h3>Hotel Location</h3>

            <div className="coordinates">
              <div className="coordinate-box">
                <span>Latitude</span>

                <strong>
                  {hotel.latitude}
                </strong>
              </div>

              <div className="coordinate-box">
                <span>Longitude</span>

                <strong>
                  {hotel.longitude}
                </strong>
              </div>

              {distance && (
                <div className="coordinate-box">
                  <span>Distance</span>
                  <strong>{distance} km away</strong>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Location on Map</h3>

            {mapUrl ? (
              <div className="hotel-map">
                <iframe
                  title={`${hotel.title} location`}
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="map-error">
                Location map is not available.
              </div>
            )}
          </div>

          <div className="detail-actions">
            <Link
              to={`/edit/${hotel.id}`}
              className="edit-btn"
            >
              Edit Hotel
            </Link>

            <Link
              to="/"
              className="back-list-btn"
            >
              Back to Hotel List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;