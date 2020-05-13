import { io } from '../index.js';
import models from '../models/index.js';

const dealAnswer = () => {
  models.Answer.find({}, function(err, answers) {
    models.Answer.populate(answers, {path: 'answers'}, function(err, answer) {
      io.emit('deal answers', answer);
    });
  }).limit(1);
}

export default dealAnswer;