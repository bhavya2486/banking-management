const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/dashboard",require("./routes/dashboardRoutes"));
app.use("/api/transactions",require("./routes/transactionRoutes"));

app.get("/", (req, res) => {res.send("Server Running");});


app.listen(5000,() => {
    console.log("Server running on port 5000");
});