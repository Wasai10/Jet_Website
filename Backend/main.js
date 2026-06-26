const config = require("./src/configs"); 
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.route");
const eventsRoutes = require("./src/routes/events.routes");
const galleryRoutes = require("./src/routes/gallery.routes");

const app = express();
const PORT = config.server.port;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("JET Ministries API is running.");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/gallery", galleryRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${config.server.nodeEnv}]`);
});
