const OpenAI = require("openai");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/calories", async (req, res) => {
  const { foodName } = req.body;

  try {
    const prompt = `Estimate the calorie content of the following Indian/homemade dish: "${foodName}". Also give a short explanation and a healthy tip.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ result: aiResponse });
  } catch (error) {
    console.error("Error with OpenAI:", error.message);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

module.exports = router;
