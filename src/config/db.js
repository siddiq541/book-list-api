const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASS);
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;
const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
console.log("MONGO_URI:", uri);

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected!!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
