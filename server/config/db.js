import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://sticknodesmarket:sticknodeclusterpassword@sticknodesmarket.1z5ol.mongodb.net/eventplanner?retryWrites=true&w=majority');
    console.log("MongoDB connected",conn.connection.host)
    console.log(`DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to DB:", error.message);
    process.exit(1); // 1 = failure, 0 = success
  }
};

export default connectDB;