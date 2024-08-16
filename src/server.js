require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");

const router = require("./router");

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use("/", router());

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
