class DataChecker {
  static checkQuestion(req, res, next) {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question?.trim() === '') {
      return res.status(400).json({
        error:
          'The question does not exist or check the type of data you are sending',
      });
    }
    next();
  }

  static checkSessionId = (req, res, next) => {
    const { session_id } = req.params;
    if (!session_id || session_id?.trim() === '') {
      return res.status(400).json({ error: 'session_id not found' });
    }
    next();
  };
}
module.exports = DataChecker;
