import { Link } from "react-router-dom";

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

const HotelCard = ({ hotel, onDelete }) => {
  const imageUrl = hotelImages[hotel.id] || defaultImage;

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