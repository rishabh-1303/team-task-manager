import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    let mongoUri = process.env.MONGO_URI;

    // Fallback to memory server if running locally without a real DB setup
    if (!mongoUri || mongoUri.includes('127.0.0.1')) {
      console.log('Starting in-memory MongoDB server for local development...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
