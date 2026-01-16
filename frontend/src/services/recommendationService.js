import axios from 'axios';

// Python Microservice URL
const REC_API_URL = 'http://localhost:8000';
// Node Backend URL (proxied via /api)
const BACKEND_API_URL = '/api/v1/analytics';

export const getHomeRecommendations = async (userId) => {
    try {
        const response = await axios.get(`${REC_API_URL}/recommend/home/${userId}`);
        return response.data.recommendations;
    } catch (error) {
        console.error("Failed to fetch home recommendations:", error);
        return [];
    }
};

export const getProductRecommendations = async (productId) => {
    try {
        const response = await axios.get(`${REC_API_URL}/recommend/product/${productId}`);
        return response.data.recommendations;
    } catch (error) {
        console.error("Failed to fetch product recommendations:", error);
        return [];
    }
};

export const logInteraction = async (productId, action, metadata = {}) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return; // logged out

        await axios.post(`${BACKEND_API_URL}/interaction`,
            { productId, action, metadata },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error("Failed to log interaction:", error);
    }
};
