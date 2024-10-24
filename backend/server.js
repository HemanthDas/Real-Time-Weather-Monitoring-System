const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weatherRoute");
const { startWeatherPolling } = require("./controllers/weatherController");
require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", weatherRoutes);
startWeatherPolling();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
