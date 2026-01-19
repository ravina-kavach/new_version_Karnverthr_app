import axios from 'axios';
import Config from 'react-native-config';

export const askChatGPT = async (message) => {
    const OPENAI_API_KEY = Config.OPENAI_API_KEY
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Chat API error:",
      error.response?.data || error.message
    );
    return "Sorry, I couldn't understand that.";
  }
};

