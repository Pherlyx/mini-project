import mongoose from 'mongoose';



const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://felix:Bukayosaka%407@felix.uktmfzn.mongodb.net/eventplanner?retryWrites=true&w=majority&appName=felix');
    console.log("MongoDB connected");
    console.log(`DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to DB:", error.message);
    process.exit(1); // 1 = failure, 0 = success
  }
};

export default connectDB;