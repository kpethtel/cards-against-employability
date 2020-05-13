import { io } from '../index.js';
import models from '../models/index.js';

const dealQuestion = () => {
  models.Question.find({}, function(err, questions) {
    models.Question.populate(questions, {path: 'questions'}, function(err, question) {
      io.emit('deal question', question);
    });
  }).limit(1);
}

export default dealQuestion;