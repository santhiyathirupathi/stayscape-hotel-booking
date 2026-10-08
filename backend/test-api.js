const http = require("http");

const hotels = [
  {
    title: "Taj Savoy Hotel",
    description:
      "Comfortable heritage hotel with peaceful surroundings and excellent hospitality.",
    latitude: 11.4064,
    longitude: 76.6932,
    price: 7500,
    location: "Ooty, Tamil Nadu",
  },
  {
    title: "Sterling Ooty Fern Hill",
    description:
      "Hill resort offering comfortable rooms and beautiful mountain views.",
    latitude: 11.4035,
    longitude: 76.6972,
    price: 6500,
    location: "Ooty, Tamil Nadu",
  },
  {
    title: "The Tamara Kodai",
    description:
      "Premium resort surrounded by the natural beauty of Kodaikanal hills.",
    latitude: 10.2381,
    longitude: 77.4892,
    price: 9000,
    location: "Kodaikanal, Tamil Nadu",
  },
  {
    title: "Sterling Kodai Lake",
    description:
      "Comfortable resort located near the scenic Kodaikanal Lake.",
    latitude: 10.2298,
    longitude: 77.4865,
    price: 7000,
    location: "Kodaikanal, Tamil Nadu",
  },
  {
    title: "Radisson Blu Coimbatore",
    description:
      "Modern hotel with comfortable rooms and convenient city access.",
    latitude: 11.0198,
    longitude: 76.9661,
    price: 5500,
    location: "Coimbatore, Tamil Nadu",
  },
  {
    title: "The Residency Towers Chennai",
    description:
      "Well-connected city hotel with comfortable rooms and modern facilities.",
    latitude: 13.0418,
    longitude: 80.2341,
    price: 6000,
    location: "Chennai, Tamil Nadu",
  },
  {
    title: "Taj Coromandel",
    description:
      "Luxury hotel in central Chennai with elegant rooms and quality service.",
    latitude: 13.0569,
    longitude: 80.2487,
    price: 8500,
    location: "Chennai, Tamil Nadu",
  },
  {
    title: "The Leela Palace Chennai",
    description:
      "Luxury seafront hotel offering comfortable accommodation and city views.",
    latitude: 13.0167,
    longitude: 80.2737,
    price: 10000,
    location: "Chennai, Tamil Nadu",
  },
  {
    title: "Hotel Lakeview Ooty",
    description:
      "Peaceful stay near the lake with comfortable rooms and scenic surroundings.",
    latitude: 11.399,
    longitude: 76.7005,
    price: 4500,
    location: "Ooty, Tamil Nadu",
  },
];

let completed = 0;

hotels.forEach((hotel) => {
  const data = JSON.stringify(hotel);

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/hotels",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  const request = http.request(options, (response) => {
    let result = "";

    response.on("data", (chunk) => {
      result += chunk;
    });

    response.on("end", () => {
      completed++;

      console.log(`${hotel.title}: ${response.statusCode}`);

      if (completed === hotels.length) {
        console.log("\n9 hotels added successfully.");
      }
    });
  });

  request.on("error", (error) => {
    console.error(error);
  });

  request.write(data);
  request.end();
});