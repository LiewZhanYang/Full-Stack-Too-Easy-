const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// Analyze sentiment
exports.analyzeSentiment = (req, res) => {
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).send({ error: "Comment is required" });
  }

  const result = sentiment.analyze(comment);

  return res.send({
    score: result.score,
    comparative: result.comparative,
    tokens: result.tokens,
    positive: result.positive,
    negative: result.negative,
  });
};
