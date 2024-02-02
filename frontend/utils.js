import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const SCHEMA_URL = 'https://raw.githubusercontent.com/Codi3And3rson/openai-node-app/master/messageSchema.json';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID; // Moved to environment variable
const OPENAI_API_URL = `https://api.openai.com/v1/assistants/${ASSISTANT_ID}/completions`;

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
let validate;

async function loadSchemaAndCreateValidator() {
    if (!validate) {
        try {
            const response = await axios.get(SCHEMA_URL);
            validate = ajv.compile(response.data);
            console.log('Schema successfully loaded and compiled');
        } catch (error) {
            console.error('Failed to load schema:', error);
            throw error;
        }
    }
    return validate;
}

export async function processJSONMessage(data) {
    await loadSchemaAndCreateValidator();
    if (validate(data)) {
        console.log('Validation successful');
    } else {
        console.error('Validation failed:', validate.errors);
    }
}

export async function processBinaryMessage(binaryData) {
    console.log('Processing binary message:', binaryData);
    // Implement binary data processing as needed
}

export async function sendToGPT(prompt) {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "text-davinci-003", // Consider updating model version
                prompt,
                temperature: 0.7,
                max_tokens: 150,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error sending data to GPT:', error);
        throw error;
    }
}
