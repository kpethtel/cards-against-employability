const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answersSchema = new Schema({
  text: String
});
module.exports = mongoose.model('answers', answersSchema);
