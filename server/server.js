import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config(); // Load environment variables from .env file

const app = express() // Create a new express app
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY })) // Create a new OpenAI API instance

app.use(cors(), express.json()) // Enable CORS and JSON body parsing

app.get('/', (req, res) => res.status(200).send({ message: 'Hello from CodeX!' })) // Test endpoint

app.post('/', async (req, res) => { // Main endpoint
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // text-davinci-003 is the best model for now
      prompt: req.body.prompt, // prompt is the text that the bot will use to generate a response
      temperature: 0, // temperature is the randomness of the response
      max_tokens: 3000, // max_tokens is the maximum number of tokens that the bot will generate
      top_p: 1, // top_p is the probability that the bot will use the next token
      frequency_penalty: 0.5, // frequency_penalty is the probability that the bot will use the same token
      presence_penalty: 0, // presence_penalty is the probability that the bot will use the same token
    });
    res.status(200).send({ bot: response.data.choices[0].text }); // Send the response to the client
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).send(error || 'Something went wrong'); // Send the error to the client
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000')); // Start the server
