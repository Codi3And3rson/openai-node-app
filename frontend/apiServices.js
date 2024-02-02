import axios from 'axios';

// Example API service function with async/await, error handling, and caching
const apiCache = new Map(); // Simple in-memory cache

async function fetchUserData(userId) {
    const cacheKey = `userData-${userId}`;
    if (apiCache.has(cacheKey)) {
        return apiCache.get(cacheKey); // Return cached data if available
    }

    try {
        const response = await axios.get(`https://example.com/api/users/${userId}`);
        const userData = response.data;
        
        apiCache.set(cacheKey, userData); // Cache the response data
        return userData;
    } catch (error) {
        console.error(`Failed to fetch user data for ${userId}:`, error);
        throw new Error('User data retrieval failed.');
    }
}

// Export the API service function for use in other parts of the application
export { fetchUserData };
