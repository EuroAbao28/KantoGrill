const express = require("express");
const cors = require("cors");
const connectDB = require("./db/monboDB");
require("dotenv").config();
require("colors");
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/admin", require("./routes/userRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/transactions", require("./routes/transactionRoute"));

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.yellow.underline)
);
