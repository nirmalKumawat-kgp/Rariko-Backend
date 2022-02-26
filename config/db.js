require("dotenv").config({ path: "../config.env" });
const mongoose = require("mongoose");
console.log(process.env.MONGODB_CONNECT_URL);

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGODB_CONNECT_URL)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));
};
module.exports = connectDB;
