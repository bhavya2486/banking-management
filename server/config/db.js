const mongoose = require("mongoose");
const dns = require("dns");

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.warn("Failed to set DNS servers:", e.message);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;