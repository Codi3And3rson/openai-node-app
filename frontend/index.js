import dotenv from 'dotenv';
import axios from 'axios';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import express from 'express';
import helmet from 'helmet'; // Security middleware for Express
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import dgram from 'dgram';
import morgan from 'morgan';
import { processJSONMessage, sendToGPT } from './utils.js';
import { parseTelemetryData } from './telemetryParsers.js';
import { loadAndCompileSchema } from './schemaValidator.js'; // Refactored schema loading and compiling

dotenv.config();

// Security enhancements: Apply Helmet for setting various HTTP headers
const app = express();
app.use(helmet());

// Initialize AJV with JSON schema support
const ajv = new Ajv({ strict: true });
addFormats(ajv);
let validate;

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Improved error handling and schema caching
async function setupApplication() {
    try {
        await loadAndCompileSchema(process.env.SCHEMA_URL || 'https://raw.githubusercontent.com/Codi3And3rson/openai-node-app/master/messageSchema.json', ajv);
        console.log('Application setup completed.');
    } catch (error) {
        console.error('Application setup failed:', error);
        process.exit(1);
    }
}

setupApplication();

// Express application routes and middleware setup
// Example: app.get('/api', (req, res) => { /* handle request */ });

// WebSocket server setup
// Example: const wss = new WebSocketServer({ port: 8080 });

app.use(morgan('combined')); // Logging HTTP requests

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
