
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const HotelDetails = () => {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/hotels/${id}`)
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

  /* LOADING */

  if (loading) {
    return (
      <div className="detail-page">
        <div className="empty-state">
          <p>Loading hotel details...</p>
        </div>
      </div>
    );
  }


  /* HOTEL NOT FOUND */

  if (!hotel) {
    return (
      <div className="detail-page">

        <div className="empty-state">

          <p>Hotel not found.</p>

          <Link
            to="/"
            className="back-btn"
          >
            ← Back to Hotels
          </Link>

        </div>

      </div>
    );
  }


  /* HOTEL IMAGE */

  const imageUrl = hotel.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `http://localhost:5000${hotel.image}`
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";


  return (
    <div className="detail-page">

      <div className="detail-container">

        {/* BACK BUTTON */}

        <div style={{ padding: "18px 20px 0" }}>

          <Link
            to="/"
            className="back-btn"
          >
            ← Back to Hotels
          </Link>

        </div>


        {/* HOTEL IMAGE */}

        <img
          src={imageUrl}
          alt={hotel.title}
          className="detail-image"
        />


        {/* HOTEL INFORMATION */}

        <div className="detail-content">

          <h1>
            {hotel.title}
          </h1>


          {/* DESCRIPTION */}

          <p>
            {hotel.description}
          </p>


          {/* PRICE */}

          <p className="detail-price">
            ₹{Number(hotel.price).toLocaleString("en-IN")}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "400",
                color: "#777",
                marginLeft: "5px",
              }}
            >
              / night
            </span>
          </p>


          {/* LOCATION */}

          <div
            className="coordinates"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "20px",
            }}
          >

            <div
              style={{
                padding: "12px",
                border: "1px solid #e0e1e4",
                borderRadius: "6px",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#777",
                  marginBottom: "5px",
                }}
              >
                Latitude
              </span>

              <strong
                style={{
                  fontSize: "13px",
                  color: "#333",
                }}
              >
                {hotel.latitude}
              </strong>

            </div>


            <div
              style={{
                padding: "12px",
                border: "1px solid #e0e1e4",
                borderRadius: "6px",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#777",
                  marginBottom: "5px",
                }}
              >
                Longitude
              </span>

              <strong
                style={{
                  fontSize: "13px",
                  color: "#333",
                }}
              >
                {hotel.longitude}
              </strong>

            </div>

          </div>


          {/* EDIT BUTTON */}

          <Link
            to={`/edit/${hotel.id}`}
            className="edit-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              textDecoration: "none",
            }}
          >
            Edit Hotel
          </Link>

        </div>

      </div>

    </div>
  );
};

export default HotelDetails;
