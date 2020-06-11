import models from '../models/index.js';

const dealQuestion = (handleQuestion) => {
  models.Question.find({}, function(err, questions) {
    models.Question.populate(questions, {path: 'questions'}, function(err, question) {
      handleQuestion(question);
    });
  }).limit(1);
}

export default dealQuestion;