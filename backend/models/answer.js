import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: String
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
