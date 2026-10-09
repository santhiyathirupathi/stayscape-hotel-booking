import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const hotelImages = {
  16: "https://i.pinimg.com/736x/36/09/08/360908ad4725d5f9b87bb6f9b26cdd91.jpg",
  10: "https://i.pinimg.com/736x/07/82/8a/07828a1af4801bc0bbf280c021fd8ce4.jpg",
  9: "https://i.pinimg.com/736x/7b/19/a5/7b19a5cbed2c9c2d703319f563cf8ba1.jpg",
  8: "https://i.pinimg.com/1200x/24/c6/9e/24c69eccbea1358ec2eb47efea13b858.jpg",
  7: "https://i.pinimg.com/1200x/ff/8d/9e/ff8d9e20a5e6d5e82282d3b033c91399.jpg",
  6: "https://i.pinimg.com/1200x/46/cf/d7/46cfd77994f3b71efb4724db9a5df660.jpg",
  5: "https://i.pinimg.com/736x/ca/05/f5/ca05f576b6502a93809cfea03d56e399.jpg",
  4: "https://i.pinimg.com/736x/5b/9c/36/5b9c3698f4b0f817f77ced04c6ba0464.jpg",
  3: "https://i.pinimg.com/736x/16/49/ad/1649adb428e1f748b4e8ba40578befb6.jpg",
  2: "https://i.pinimg.com/736x/4c/ca/7e/4cca7e65b7637e458c9067d0be4cc716.jpg",
};

const defaultImage =
  "https://i.pinimg.com/736x/36/09/08/360908ad4725d5f9b87bb6f9b26cdd91.jpg";

const HotelDetails = () => {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://stayscape-backend-hsty.onrender.com/api/hotels/${id}`
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

  const imageUrl =
    hotelImages[hotel.id] ||
    (hotel.image?.startsWith("http")
      ? hotel.image
      : defaultImage);

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

        {/* BACK */}

        <div className="detail-top-bar">
          <Link
            to="/"
            className="back-btn"
          >
            ← Back to Hotels
          </Link>
        </div>

        {/* IMAGE */}

        <img
          src={imageUrl}
          alt={hotel.title}
          className="detail-image"
        />

        {/* CONTENT */}

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

          {/* DESCRIPTION */}

          <div className="detail-section">

            <h3>About this hotel</h3>

            <p className="detail-description">
              {hotel.description}
            </p>

          </div>

          {/* COORDINATES */}

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

          {/* MAP */}

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

          {/* ACTIONS */}

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