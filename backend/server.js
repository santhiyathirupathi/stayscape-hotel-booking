const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* UPLOAD FOLDER */

const uploadFolder = path.join(
  __dirname,
  "uploads"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

/* MULTER */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

/* SERVE IMAGES */

app.use(
  "/uploads",
  express.static(uploadFolder)
);

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

    /* TITLE SEARCH */

    if (title.trim() !== "") {
      conditions.push(
        `title ILIKE $${valueIndex}`
      );

      values.push(
        `%${title.trim()}%`
      );

      valueIndex++;
    }

    /* MIN PRICE */

    if (
      minPrice !== undefined &&
      minPrice !== ""
    ) {
      conditions.push(
        `price >= $${valueIndex}`
      );

      values.push(Number(minPrice));

      valueIndex++;
    }

    /* MAX PRICE */

    if (
      maxPrice !== undefined &&
      maxPrice !== ""
    ) {
      conditions.push(
        `price <= $${valueIndex}`
      );

      values.push(Number(maxPrice));

      valueIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    /* TOTAL */

    const countResult = await pool.query(
      `SELECT COUNT(*)
       FROM hotels
       ${whereClause}`,
      values
    );

    const total = Number(
      countResult.rows[0].count
    );

    /* CURRENT PAGE */

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

app.get(
  "/api/hotels/:id",
  async (req, res) => {
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
  }
);

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

      if (
        !description ||
        !description.trim()
      ) {
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

      let imagePath = null;

      if (req.file) {
        imagePath =
          `/uploads/${req.file.filename}`;
      }

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
          imagePath,
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

      if (
        !description ||
        !description.trim()
      ) {
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

      let imagePath =
        oldHotel.rows[0].image;

      /* UPDATE IMAGE */

      if (req.file) {
        imagePath =
          `/uploads/${req.file.filename}`;

        if (oldHotel.rows[0].image) {
          const oldImagePath =
            path.join(
              __dirname,
              oldHotel.rows[0].image
            );

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

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
          imagePath,
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

app.delete(
  "/api/hotels/:id",
  async (req, res) => {
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

      const hotel =
        hotelResult.rows[0];

      /* DELETE IMAGE */

      if (hotel.image) {
        const imagePath = path.join(
          __dirname,
          hotel.image
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      /* DELETE HOTEL */

      await pool.query(
        "DELETE FROM hotels WHERE id = $1",
        [id]
      );

      res.json({
        message:
          "Hotel deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete hotel",
      });
    }
  }
);

/* START SERVER */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});