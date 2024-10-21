const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// fetch the routes
app.use("/", require("./routes"));

//use cors

// Starting the server
const server = app.listen(process.env.PORT, async () => {
  console.log("Server started on port:", process.env.PORT);
  const pool = require("./utils/db-config");
});
