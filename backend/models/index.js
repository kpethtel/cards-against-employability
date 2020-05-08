import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Answer from './answer.js';
import Question from './question.js';

dotenv.config();

const connectDb = () => {
  return mongoose.connect(process.env.DB_URL);
};

const models = { Answer, Question };

export { connectDb };

export default models;
