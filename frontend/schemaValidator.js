import axios from 'axios';

/**
 * Loads a JSON schema from a URL and compiles it using the provided AJV instance.
 * @param {string} schemaUrl - The URL from which to load the JSON schema.
 * @param {import('ajv').Ajv} ajv - The AJV instance used for compiling the schema.
 * @returns {Promise<Function>} A promise that resolves to the compiled schema validation function.
 */
export async function loadAndCompileSchema(schemaUrl, ajv) {
    try {
        const response = await axios.get(schemaUrl);
        const validate = ajv.compile(response.data);
        console.log('Schema successfully loaded and compiled.');
        return validate;
    } catch (error) {
        console.error(`Error loading and compiling schema from ${schemaUrl}:`, error);
        throw error; // Rethrow to allow caller to handle or fail initialization
    }
}
