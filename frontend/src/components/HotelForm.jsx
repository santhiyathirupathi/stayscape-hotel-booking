import { useEffect, useState } from "react";

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
    setLatitude(initialData.latitude || "");
    setLongitude(initialData.longitude || "");
    setPrice(initialData.price || "");

    if (initialData.image) {
      if (initialData.image.startsWith("http")) {
        setPreview(initialData.image);
      } else {
        setPreview("");
      }
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

    if (latitude === "") {
      newErrors.latitude =
        "Latitude is required";
    }

    if (longitude === "") {
      newErrors.longitude =
        "Longitude is required";
    }

    if (price === "") {
      newErrors.price = "Price is required";
    } else if (Number(price) <= 0) {
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