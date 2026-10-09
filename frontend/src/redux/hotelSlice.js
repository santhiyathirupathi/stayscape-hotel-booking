import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://stayscape-backend-hsty.onrender.com/api/hotels";

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (params = {}) => {
    const query = new URLSearchParams();

    if (params.title?.trim()) {
      query.append("title", params.title.trim());
    }

    if (params.minPrice !== "" && params.minPrice != null) {
      query.append("minPrice", params.minPrice);
    }

    if (params.maxPrice !== "" && params.maxPrice != null) {
      query.append("maxPrice", params.maxPrice);
    }

    query.append("offset", params.offset ?? 0);
    query.append("limit", params.limit ?? 6);

    const response = await fetch(`${API_URL}?${query.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }

    return await response.json();
  }
);

export const fetchHotelById = createAsyncThunk(
  "hotels/fetchHotelById",
  async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch hotel");
    }

    return await response.json();
  }
);

export const addHotel = createAsyncThunk(
  "hotels/addHotel",
  async (hotelData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      body: hotelData,
    });

    if (!response.ok) {
      throw new Error("Failed to add hotel");
    }

    return await response.json();
  }
);

export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({ id, hotelData }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: hotelData,
    });

    if (!response.ok) {
      throw new Error("Failed to update hotel");
    }

    return await response.json();
  }
);

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete hotel");
    }

    return { id };
  }
);

const initialState = {
  hotels: [],
  total: 0,
  offset: 0,
  limit: 6,
  selectedHotel: null,
  loading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,

  reducers: {
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload;

        if (Array.isArray(data)) {
          state.hotels = data;
          state.total = data.length;
          state.offset = 0;
          state.limit = 6;
          return;
        }

        if (data && Array.isArray(data.hotels)) {
          state.hotels = data.hotels;
          state.total = Number(data.total) || data.hotels.length;
          state.offset = Number(data.offset) || 0;
          state.limit = Number(data.limit) || 6;
          return;
        }

        state.hotels = [];
        state.total = 0;
        state.offset = 0;
        state.limit = 6;
      })

      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.hotels = [];
        state.total = 0;
        state.error =
          action.error.message || "Failed to fetch hotels";
      })

      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedHotel =
          action.payload?.hotel ||
          action.payload?.data ||
          action.payload;
      })

      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch hotel";
      })

      .addCase(addHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addHotel.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(addHotel.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to add hotel";
      })

      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedHotel =
          action.payload?.hotel ||
          action.payload?.data ||
          action.payload;

        if (updatedHotel?.id) {
          const index = state.hotels.findIndex(
            (hotel) => hotel.id === updatedHotel.id
          );

          if (index !== -1) {
            state.hotels[index] = updatedHotel;
          }

          state.selectedHotel = updatedHotel;
        }
      })

      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update hotel";
      })

      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;

        state.hotels = state.hotels.filter(
          (hotel) => hotel.id !== action.payload.id
        );

        state.total = Math.max(0, state.total - 1);
      })

      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to delete hotel";
      });
  },
});

export const { clearSelectedHotel } = hotelSlice.actions;

export default hotelSlice.reducer;