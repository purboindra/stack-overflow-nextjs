import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MISSING MONGODB URL");

  if (isConnected) {
    return console.log("MONGODB IS ALREADY CONNECTED");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "devflow",
    });

    isConnected = true;

    console.log("MONGODB IS CONNECTED");
  } catch (error) {
    console.log("ERROR MONGO DB CONNECT", error);
  }
};
