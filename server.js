require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const calculateRoutes = require("./routes/calculateRoutes");
const userRoutes = require("./routes/userRoutes");
const projectsRoutes = require("./routes/projectsRoutes"); 

app.use(cors({ origin: "http://localhost:3000" }));


app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/api/test", (req, res) => {
  res.json({ message: "Бэкенд работает!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

