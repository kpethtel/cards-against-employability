import models from '../models/index.js';

const fetchQuestion = (handleQuestion) => {
  models.Question.find({}, (err, questions) => {
    models.Question.populate(questions, {path: 'questions'}, (err, question) => {
      handleQuestion(question);
    });
  }).limit(1);
}

export default fetchQuestion;