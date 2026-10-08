import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import HotelForm from "../components/HotelForm";
import { addHotel } from "../redux/hotelSlice";

const AddHotel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    const result = await dispatch(
      addHotel(formData)
    );

    if (addHotel.fulfilled.match(result)) {
      alert("Hotel added successfully");
      navigate("/");
    } else {
      alert("Failed to add hotel");
    }
  };

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div>
          <h1>Add Hotel</h1>
          <p>Add a new hotel to the list</p>
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
        onSubmit={handleSubmit}
        submitText="Add Hotel"
      />
    </div>
  );
};

export default AddHotel;