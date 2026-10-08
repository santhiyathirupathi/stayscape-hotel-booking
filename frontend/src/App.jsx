import { Routes, Route } from "react-router-dom";

import HotelList from "./pages/HotelList";
import HotelDetails from "./pages/HotelDetails";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";

const App = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={<HotelList />}
      />

      <Route
        path="/add"
        element={<AddHotel />}
      />

      <Route
        path="/edit/:id"
        element={<EditHotel />}
      />

      <Route
        path="/hotel/:id"
        element={<HotelDetails />}
      />

    </Routes>
  );
};

export default App;