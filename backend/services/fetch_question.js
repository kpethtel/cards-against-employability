import models from '../models/index.js';

const fetchQuestion = (excluded, handleQuestion) => {
  models.Question.findOne({_id: {$nin: excluded}}, (err, response) => {
    models.Question.populate(response, {path: 'questions'}, (err, question) => {
      handleQuestion(question);
    });
  });
}

export default fetchQuestion;