import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required in server/.env');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Mongodb is connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }

  return mongoose.connection;
};

export default connectDB;
