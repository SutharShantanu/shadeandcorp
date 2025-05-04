import mongoose from "mongoose";

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      "MongoDB connection error. Please make sure MongoDB is running. ",
      error
    );
    process.exit(1);
  }
}
