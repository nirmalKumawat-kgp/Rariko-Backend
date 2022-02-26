require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const app = express();
const PORT = process.env.PORT || 8000;
// parsing the body
app.use(express.json());
//Database Connection
connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
//Error Handler (Last Middleware)
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error : ${err}`);
  server.close(() => process.exit(1));
});
