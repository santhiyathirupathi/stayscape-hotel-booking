import { useEffect, useState } from "react";
import { getImageUrl } from "../api";

const HotelForm = ({
  initialData,
  onSubmit,
  submitText = "Add Hotel",
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) {
      setTitle("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setPrice("");
      setImage(null);
      setPreview("");
      return;
    }

    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setLatitude(initialData.latitude !== undefined ? String(initialData.latitude) : "");
    setLongitude(initialData.longitude !== undefined ? String(initialData.longitude) : "");
    setPrice(initialData.price !== undefined ? String(initialData.price) : "");

    if (initialData.image) {
      setPreview(getImageUrl(initialData.image));
    } else {
      setPreview("");
    }

    setImage(null);
    setErrors({});
  }, [initialData]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    setImage(selectedImage);

    const imagePreview = URL.createObjectURL(
      selectedImage
    );

    setPreview(imagePreview);
  };

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description =
        "Description is required";
    }

    const latNum = Number(latitude);
    if (latitude === "" || latitude === null || isNaN(latNum)) {
      newErrors.latitude =
        "Valid latitude is required (-90 to 90)";
    } else if (latNum < -90 || latNum > 90) {
      newErrors.latitude =
        "Latitude must be between -90 and 90";
    }

    const lngNum = Number(longitude);
    if (longitude === "" || longitude === null || isNaN(lngNum)) {
      newErrors.longitude =
        "Valid longitude is required (-180 to 180)";
    } else if (lngNum < -180 || lngNum > 180) {
      newErrors.longitude =
        "Longitude must be between -180 and 180";
    }

    const priceNum = Number(price);
    if (price === "" || price === null || isNaN(priceNum)) {
      newErrors.price = "Valid price is required";
    } else if (priceNum <= 0) {
      newErrors.price =
        "Price must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append(
      "description",
      description.trim()
    );
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("price", price);

    if (image) {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  return (
    <form
      className="hotel-form"
      onSubmit={handleSubmit}
    >

      

      <div className="form-group image-group">

        <label>Hotel Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <div className="preview-box">
            <img
              src={preview}
              alt="Hotel preview"
              className="image-preview"
            />
          </div>
        )}

      </div>

    

      <div className="form-group">

        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Enter hotel name"
        />

        {errors.title && (
          <p className="error">
            {errors.title}
          </p>
        )}

      </div>

      

      <div className="form-group">

        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Enter hotel description"
          rows="5"
        />

        {errors.description && (
          <p className="error">
            {errors.description}
          </p>
        )}

      </div>

     

      <div className="form-row">

        <div className="form-group">

          <label>Latitude</label>

          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value)
            }
            placeholder="Enter latitude"
          />

          {errors.latitude && (
            <p className="error">
              {errors.latitude}
            </p>
          )}

        </div>

        <div className="form-group">

          <label>Longitude</label>

          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value)
            }
            placeholder="Enter longitude"
          />

          {errors.longitude && (
            <p className="error">
              {errors.longitude}
            </p>
          )}

        </div>

      </div>

     

      <div className="form-group">

        <label>Price</label>

        <input
          type="number"
          min="1"
          step="0.01"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          placeholder="Enter hotel price"
        />

        {errors.price && (
          <p className="error">
            {errors.price}
          </p>
        )}

      </div>

     

      <button
        type="submit"
        className="submit-btn"
      >
        {submitText}
      </button>

    </form>
  );
};

export default HotelForm;