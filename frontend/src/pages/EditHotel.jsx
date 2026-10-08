import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import HotelForm from "../components/HotelForm";

import {
  fetchHotelById,
  updateHotel,
} from "../redux/hotelSlice";

const EditHotel = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedHotel, loading } = useSelector(
    (state) => state.hotels
  );

  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedHotel) {
      setHotel(selectedHotel);
    }
  }, [selectedHotel]);

  const handleSubmit = async (formData) => {
    const result = await dispatch(
      updateHotel({
        id,
        hotelData: formData,
      })
    );

    if (updateHotel.fulfilled.match(result)) {
      alert("Hotel updated successfully");
      navigate("/");
    } else {
      alert("Failed to update hotel");
    }
  };

  if (loading || !hotel) {
    return (
      <div className="status-message">
        Loading hotel...
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div>
          <h1>Edit Hotel</h1>
          <p>Update hotel details</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="back-btn"
        >
          ← Back
        </button>
      </div>

      <HotelForm
        initialData={hotel}
        onSubmit={handleSubmit}
        submitText="Update Hotel"
      />
    </div>
  );
};

export default EditHotel;