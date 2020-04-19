const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
  text: String
});
module.exports = mongoose.model('questions', questionsSchema);
