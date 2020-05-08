import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: String
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
