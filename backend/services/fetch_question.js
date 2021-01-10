import models from '../models/index.js';

function fetchQuestion(excluded) {
  return models.Question.findById({$nin: excluded}).populate('questions')
}

export default fetchQuestion;