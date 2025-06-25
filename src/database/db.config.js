import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI_STRING);
    console.log("Application connected to MongoDB successfully");
  } catch (error) {
    console.error(error.message);
    throw new Error("Database connection failed");
  }
};

export default ConnectDB;
