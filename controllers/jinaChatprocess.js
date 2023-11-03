const JinaAI = require('jinaai');
const getdatat = require('../services/getdata');

const jinaai = new JinaAI({
  secrets: {
    'jinachat-secret': process.env.JINACHAT_SECRET || '',
  },
});

class jinaAi {
  static async questionGroups(question) {
    try {
      const groups = await getdatat.queryGroup();
      if (!groups) {
        throw new Error(
          "Question data not found. Please check the session and try again."
        );
      }
      const prompt = [
        'Given the provided groups, identify the group whose "name" key best corresponds to the context of the question. If no group fits the context or if the question does not belong to any group, propose a group name.',
        'Answer with a JSON element containing the "id", "name", "slug", and "question" keys of the group that best matches the context of the question if you were provided with GROUPs. If no GROUP is provided or if the question does not belong to any GROUP, return a JSON array with only the key "name" of the group you suggested for the question and "question" as the question asked.',
        `QUESTION:\n${question}`,
        ...(groups.length !== 0
          ? groups.map(
              (group) =>
                `GROUP:\n {\n id: '${group.id}',\n name: '${group.name}',\n slug: '${group.slug}',\n }`
            )
          : []),
      ].join('\n');

      const feeling = await jinaai.generate(prompt);
      return feeling.output;
    } catch (error) {
      console.log(error);
      throw new Error("Error processing the Question.");
    }
  }

  static async categoryOfQuestion(question) {
    try {
      const categories = await getdatat.getDatatCategory();
      if (!categories || !categories.length === 0) {
        throw new Error(
          "Category data not found. Please check the session and try again."
        );
      }

      const prompt = [
        'Analyze the question in context. Determine which category best matches the key name of the CATEGORY object for this question.',
        'Answer with only a JSON element containing the id, name, slug keys of the category that corresponds to the question.',
        `QUESTION:\n${question}`,
        ...categories.map(
          (category) =>
            `CATEGORY:\n {\n id: '${category.id}',\n name: '${category.name}',\n slug: '${category.slug}', }`
        ),
      ].join('\n');

      const feeling = await jinaai.generate(prompt);
      return feeling.output;
    } catch (error) {
      console.log(error);
      throw new Error("Error processing the Category.");
    }
  }

  static async questionFaqResponse(question) {
    try {
      const faq_questions = await getdatat.queryFaqQuestion();
      if (!faq_questions || !faq_questions.length === 0) {
        throw new Error(
          'FAQ data not found. Please check the session and try again.'
        );
      }

      const prompt = [
        'Analyze the meaning, context of the question and the content of the answer, is the key question similar to that of the question?',
        'Answer only with a json array containing the key id, question, answer of the corresponding RESPONSE of the question',
        `QUESTION:\n${question}`,
        ...faq_questions.map(
          (faq) =>
            `RESPONSE:\n  {\n    id: '${faq.id}',\n    question: '${faq.question}',\n  answer: '${faq.answer}', \n}`
        ),
      ].join('\n');

      const feeling = await jinaai.generate(prompt);
      return feeling.output;
    } catch (error) {
      console.log(error);
      throw new Error("Error processing the FAQ.");
    }
  }

  static async groupQuestionsResponse(question) {
    try {
      const result = await jinaAi.questionGroups(question);
      return result !== "" ? JSON.parse(result) : result;
    } catch (error) {
      console.log(error);
      throw new Error("Error processing please try again.");
    }
  }
}

module.exports = jinaAi;
