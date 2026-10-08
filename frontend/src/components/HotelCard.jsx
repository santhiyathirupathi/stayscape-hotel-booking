import { Link } from "react-router-dom";

const fallbackImages = {
  16: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
  10: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80",
  9: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80",
  8: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=500&q=80",
  7: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=500&q=80",
  6: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80",
};

const HotelCard = ({ hotel, onDelete }) => {
  const imageUrl = hotel.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `http://localhost:5000${hotel.image}`
    : fallbackImages[hotel.id] ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80";

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