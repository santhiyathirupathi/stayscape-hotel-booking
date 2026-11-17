import { Link } from "react-router-dom";

const defaultImage =
  "https://i.pinimg.com/736x/36/09/08/360908ad4725d5f9b87bb6f9b26cdd91.jpg";

const HotelCard = ({ hotel, onDelete }) => {
  const imageUrl = hotel.image?.startsWith("http")
    ? hotel.image
    : defaultImage;

  return (
    <article className="hotel-card">
      <Link
        to={`/hotel/${hotel.id}`}
        className="hotel-card-image-link"
      >
        <img
          src={imageUrl}
          alt={hotel.title}
          className="hotel-card-image"
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