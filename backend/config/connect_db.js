import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = () => {
  return mongoose.connect(process.env.DB_URL);
};

export default connectDb;
