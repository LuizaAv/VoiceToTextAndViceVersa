const { Configuration, OpenAIApi } = require("openai");
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;

const gtts = require('gtts');

const messageStore = new Map();

app.route("/question")
  .post((req, res) => {
    const message = req.body.message;
    console.log(message);
    const clientId = Date.now().toString();
    messageStore.set(clientId, message);

    res.json({ clientId: clientId });
  })
  .get((req, res) => {
    const clientId = req.query.clientId;
    const storedMessage = messageStore.get(clientId);
    console.log(storedMessage)
  
    CHATGPT(storedMessage);

    async function CHATGPT(text) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: text,
          max_tokens: 2000
        });
        const mess = completion.data.choices[0].text;
        const speech = new gtts(mess);
        const filePath = path.join(__dirname, 'voiceMessage', 'speech.mp3');
        speech.save(filePath, () => {
          res.sendFile(filePath);
        });
      } catch (error) {
        console.log(error);
      }
    }
  });

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});