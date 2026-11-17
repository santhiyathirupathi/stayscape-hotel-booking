import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../api";

const defaultImage =
  "https://i.pinimg.com/736x/36/09/08/360908ad4725d5f9b87bb6f9b26cdd91.jpg";

const HotelDetails = () => {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${API_URL}/${id}`
    )
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

  if (loading) {
    return (
      <div className="detail-page">
        <div className="empty-state">
          <p>Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="detail-page">
        <div className="empty-state">
          <p>Hotel not found.</p>

          <Link to="/" className="back-btn">
            ← Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = hotel.image?.startsWith("http")
    ? hotel.image
    : defaultImage;

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
          alt={hotel.title}
          className="detail-image"
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