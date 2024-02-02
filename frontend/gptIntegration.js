import axios from 'axios';

// Assuming an environment variable for the GPT API key
const gptApiKey = process.env.GPT_API_KEY;
const gptApiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

const axiosInstance = axios.create({
    baseURL: gptApiUrl,
    headers: {
        'Authorization': `Bearer ${gptApiKey}`,
        'Content-Type': 'application/json',
    },
});

// Function to query GPT with retry logic
async function queryGPT(prompt, retries = 3) {
    let lastError;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axiosInstance.post('', { prompt });
            return response.data.choices[0].text; // Assuming a text response
        } catch (error) {
            console.error(`GPT request failed (attempt ${attempt + 1}):`, error);
            lastError = error;
            // Implement a delay between retries if desired
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    // All retries failed, throw the last error
    throw lastError;
}

// Example usage
async function generateText(prompt) {
    try {
        const generatedText = await queryGPT(prompt);
        console.log('Generated Text:', generatedText);
        // Process and utilize the generated text here
    } catch (error) {
        console.error('Failed to generate text with GPT:', error);
        // Handle the error appropriately
    }
}

export { generateText };
