const axios = require('axios');

class getdatat {
  static async getDatatCategory() {
    try {
      const response = await axios.get(
        "https://kamgoko.com/demos/paul/ceo-talk-qa/wp-json/ceo-talk-qa/v1/categories"
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async queryGroup(session_id) {
    try {
      const response = await axios.get(
        `https://kamgoko.com/demos/paul/ceo-talk-qa/wp-json/ceo-talk-qa/v1/question-groups`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async queryFaqQuestion() {
    try {
      const response = await axios.get(
        'https://kamgoko.com/demos/paul/ceo-talk-qa/wp-json/ceo-talk-qa/v1/faq'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = getdatat;
