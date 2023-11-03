require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const DataChecker = require('./controllers/datachecker');
const jinaAi = require('./controllers/jinaChatprocess');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post(
  '/api/question-category-query',
  DataChecker.checkQuestion,
  async (req, res) => {
    try {
      const { question } = req.body;
      const result = await jinaAi.categoryOfQuestion(question);
      const resultGroup = await jinaAi.groupQuestionsResponse(question);
      const groupQuestionsResponse = {
        category: result !== "" ? JSON.parse(result) : result,
        group: resultGroup,
      };
      res.status(200).json(groupQuestionsResponse);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

app.post(
  '/api/question-faq-query',
  DataChecker.checkQuestion,
  async (req, res) => {
    try {
      const { question } = req.body;
      const result = await jinaAi.questionFaqResponse(question);
      res.status(200).json(result != "" ? JSON.parse(result) : result);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    error: 'An error occurred during data processing by the AI. Try Again',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
