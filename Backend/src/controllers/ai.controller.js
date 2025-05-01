const aiService = require("../services/ai.services");
const parseReview=require("../Utils/ai.parseReview");

module.exports.getReview= async (req, res) => {
  const code = req.body.code;
  const language = req.body.language || "javascript";

  if (!code) {
    return res.status(400).send("Code is required");
  }

  try {
    const aiRawResponse = await aiService(code, language);
    const parsed = parseReview(aiRawResponse);

    res.json(parsed); // ✅ Send structured response
    console.log(parsed)
  } catch (error) {
    console.error("AI Review Error:", error);
    res.status(500).send("Something went wrong while processing the review.");
  }};