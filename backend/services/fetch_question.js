import Question from '../models/question.js';

async function fetchQuestion(excluded) {
  const questions = await Question.aggregate([
    { $match: { _id: { $nin: excluded }}},
    { $sample: { size: 1 }},
  ]);
  return questions[0];
}

export default fetchQuestion;