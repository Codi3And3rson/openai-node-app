// Centralized error handling function
function handleError(error, context = 'Parsing data', packetType = '') {
    console.error(`${context} error in ${packetType}:`, error.message);
    // Instead of throwing the error here, you can return an error object or handle it gracefully.
    return { error: `${context} failed for ${packetType}: ${error.message}` };
}

// Extended validation using a schema-like approach
function validateTelemetryData(data, packetType) {
    const schemas = {
        CarTelemetryData: {
            speed: 'number',
            throttle: 'number',
            steer: 'number',
            brake: 'number',
            clutch: 'number',
            gear: 'number',
            engineRPM: 'number',
            drs: 'number',
            revLightsPercent: 'number',
            brakesTemperature: ['number'],
            tyresSurfaceTemperature: ['number'],
            engineTemperature: 'number',
            tyresPressure: ['number'],
            // Add more fields as necessary
        },
        // Additional schemas for other packet types...
    };

    const schema = schemas[packetType];
    if (!schema) {
        return { error: `No validation schema found for packet type: ${packetType}` };
    }

    for (const key in schema) {
        const type = schema[key];
        const value = data[key];

        if (Array.isArray(type)) {
            if (!Array.isArray(value)) {
                return { error: `Invalid telemetry data: ${key} is not an array.` };
            }
            // Further array content validation can be added here if needed
        } else if (typeof value !== type) {
            return { error: `Invalid telemetry data: ${key} is not a ${type}.` };
        }
    }

    // If validation is successful, return null or an object to indicate success
    return null;
}

// Enhanced function for parsing telemetry data with error handling and validation
export function parseTelemetryData(data, packetType) {
    try {
        const parsedData = JSON.parse(data);
        const validationError = validateTelemetryData(parsedData, packetType);

        if (validationError) {
            // Handle validation error gracefully
            return validationError;
        }

        const normalizedData = normalizeData(parsedData, packetType);
        return normalizedData;
    } catch (error) {
        return handleError(error, 'Parsing telemetry data', packetType);
    }
}

// Enhanced normalization function
function normalizeData(data, packetType) {
    const normalizedData = { ...data };

    switch (packetType) {
        case 'CarTelemetryData':
            if (normalizedData.speed) {
                normalizedData.speed *= 1.60934; // Convert MPH to KPH
            }
            if (normalizedData.brakesTemperature) {
                normalizedData.brakesTemperature = normalizedData.brakesTemperature.map(temp => (temp * 9) / 5 + 32);
            }
            if (normalizedData.tyresPressure) {
                normalizedData.tyresPressure = normalizedData.tyresPressure.map(pressure => pressure * 0.145038);
            }
            // Add more normalization rules as needed
            break;
        // Case for other packet types...
    }
    return normalizedData;
}

// Function to prepare telemetry data for visualization
export function prepareDataForVisualization(data, packetType) {
    // Example: Aggregate and calculate average speed for CarTelemetryData
    if (packetType === 'CarTelemetryData') {
        const avgSpeed = data.reduce((acc, curr) => acc + curr.speed, 0) / data.length;
        return { avgSpeed };
    }
    // Extend with more cases as needed for different packet types and metrics
    return data; // Default return the original data if no processing is defined
}
