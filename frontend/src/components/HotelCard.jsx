import { Link } from "react-router-dom";
import { getImageUrl, DEFAULT_HOTEL_IMAGE } from "../api";

const HotelCard = ({ hotel, onDelete }) => {
  const imageUrl = getImageUrl(hotel.image);

  return (
    <article className="hotel-card">
      <Link
        to={`/hotel/${hotel.id}`}
        className="hotel-card-image-link"
      >
        <img
          src={imageUrl}
          alt={`Photo of ${hotel.title}`}
          className="hotel-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_HOTEL_IMAGE;
          }}
        />
      </Link>

      <div className="hotel-card-content">
        <div className="hotel-card-main">
          <Link
            to={`/hotel/${hotel.id}`}
            className="hotel-card-title"
          >
            {hotel.title}
          </Link>

          <div className="hotel-card-location">
            Hotel accommodation
          </div>

          <p className="hotel-card-description">
            {hotel.description}
          </p>

          <div className="hotel-location">
            Latitude: {hotel.latitude}
            <br />
            Longitude: {hotel.longitude}
          </div>
        </div>

        <div className="hotel-card-side">
          <div className="hotel-price-section">
            <div className="hotel-card-price">
              ₹{Number(hotel.price).toLocaleString("en-IN")}
            </div>

            <span className="price-night">
              per night
            </span>
          </div>

          <div className="hotel-card-actions">
            <Link
              to={`/hotel/${hotel.id}`}
              className="view-btn"
            >
              View Details
            </Link>

            <Link
              to={`/edit/${hotel.id}`}
              className="edit-btn"
            >
              Edit
            </Link>

            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(hotel.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;