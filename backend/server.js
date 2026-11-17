const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* UPLOADS DIRECTORY & STATIC SERVING */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

/* CLOUDINARY */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* MULTER */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* HELPER: SAVE FILE (CLOUDINARY OR LOCAL DISK) */
const saveUploadedFile = async (file) => {
  if (!file) return null;

  // Try Cloudinary first if configured
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const secureUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "stayscape-hotels" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });

      if (secureUrl) return secureUrl;
    } catch (cloudErr) {
      console.warn("Cloudinary upload failed, falling back to local file storage:", cloudErr.message);
    }
  }

  // Fallback: save to local uploads directory
  const ext = path.extname(file.originalname) || ".jpg";
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${filename}`;
};

/* HOME */

app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      message: "StayScape Hotel API is running",
      database: "PostgreSQL connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

/* GET HOTELS */

app.get("/api/hotels", async (req, res) => {
  try {
    const {
      title = "",
      minPrice,
      maxPrice,
      offset = 0,
      limit = 6,
    } = req.query;

    let conditions = [];
    let values = [];
    let valueIndex = 1;

    if (title.trim() !== "") {
      conditions.push(`title ILIKE $${valueIndex}`);

      values.push(`%${title.trim()}%`);

      valueIndex++;
    }

    if (minPrice !== undefined && minPrice !== "") {
      conditions.push(`price >= $${valueIndex}`);

      values.push(Number(minPrice));

      valueIndex++;
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      conditions.push(`price <= $${valueIndex}`);

      values.push(Number(maxPrice));

      valueIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)
       FROM hotels
       ${whereClause}`,
      values
    );

    const total = Number(countResult.rows[0].count);

    const hotelResult = await pool.query(
      `SELECT *
       FROM hotels
       ${whereClause}
       ORDER BY id DESC
       LIMIT $${valueIndex}
       OFFSET $${valueIndex + 1}`,
      [
        ...values,
        Number(limit),
        Number(offset),
      ]
    );

    res.json({
      hotels: hotelResult.rows,
      total,
      offset: Number(offset),
      limit: Number(limit),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch hotels",
    });
  }
});

/* GET SINGLE HOTEL */

app.get("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch hotel",
    });
  }
});

/* CREATE HOTEL */

app.post(
  "/api/hotels",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        latitude,
        longitude,
        price,
      } = req.body;

      /* VALIDATION */

      if (!title || !title.trim()) {
        return res.status(400).json({
          message: "Title is required",
        });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({
          message: "Description is required",
        });
      }

      if (
        latitude === undefined ||
        latitude === ""
      ) {
        return res.status(400).json({
          message: "Latitude is required",
        });
      }

      if (
        longitude === undefined ||
        longitude === ""
      ) {
        return res.status(400).json({
          message: "Longitude is required",
        });
      }

      if (
        price === undefined ||
        price === "" ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          message: "Valid price is required",
        });
      }

      /* PROCESS IMAGE */
      let imageUrl = null;
      if (req.file) {
        imageUrl = await saveUploadedFile(req.file);
      }

      /* DATABASE */

      const result = await pool.query(
        `INSERT INTO hotels
        (
          title,
          description,
          latitude,
          longitude,
          price,
          image
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          title.trim(),
          description.trim(),
          latitude,
          longitude,
          price,
          imageUrl,
        ]
      );

      res.status(201).json({
        message: "Hotel added successfully",
        hotel: result.rows[0],
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to add hotel",
      });
    }
  }
);

/* UPDATE HOTEL */

app.put(
  "/api/hotels/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        title,
        description,
        latitude,
        longitude,
        price,
      } = req.body;

      /* VALIDATION */

      if (!title || !title.trim()) {
        return res.status(400).json({
          message: "Title is required",
        });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({
          message: "Description is required",
        });
      }

      if (
        latitude === undefined ||
        latitude === ""
      ) {
        return res.status(400).json({
          message: "Latitude is required",
        });
      }

      if (
        longitude === undefined ||
        longitude === ""
      ) {
        return res.status(400).json({
          message: "Longitude is required",
        });
      }

      if (
        price === undefined ||
        price === "" ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          message: "Valid price is required",
        });
      }

      /* GET OLD HOTEL */

      const oldHotel = await pool.query(
        "SELECT * FROM hotels WHERE id = $1",
        [id]
      );

      if (oldHotel.rows.length === 0) {
        return res.status(404).json({
          message: "Hotel not found",
        });
      }

      /* KEEP OLD IMAGE */

      let imageUrl = oldHotel.rows[0].image;

      /* PROCESS IMAGE */
      if (req.file) {
        imageUrl = await saveUploadedFile(req.file);
      }

      /* UPDATE DATABASE */

      const result = await pool.query(
        `UPDATE hotels
         SET
           title = $1,
           description = $2,
           latitude = $3,
           longitude = $4,
           price = $5,
           image = $6
         WHERE id = $7
         RETURNING *`,
        [
          title.trim(),
          description.trim(),
          latitude,
          longitude,
          price,
          imageUrl,
          id,
        ]
      );

      res.json({
        message: "Hotel updated successfully",
        hotel: result.rows[0],
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update hotel",
      });
    }
  }
);

/* DELETE HOTEL */

app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const hotelResult = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (hotelResult.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    await pool.query(
      "DELETE FROM hotels WHERE id = $1",
      [id]
    );

    res.json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete hotel",
    });
  }
});

/* START SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});