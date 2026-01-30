import axios from 'axios';
import api from './api';

// Python Microservice URL
const REC_API_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
// Node Backend URL (proxied via /api for logging)
const BACKEND_API_URL = '/analytics';

export const getHomeRecommendations = async (userId) => {
    try {
        // user_id in python engine is string 
        const response = await axios.get(`${REC_API_URL}/recommend/home/${userId}`);
        // Python returns { recommendations: [] }
        return response.data.recommendations || [];
    } catch (error) {
        console.error("Failed to fetch home recommendations from AI Engine:", error);
        // Fallback to simple latest products if AI fails
        try {
            const fallback = await api.get(`/products?limit=4`);
            return fallback.data.data.products;
        } catch (e) {
            return [];
        }
    }
};

export const getProductRecommendations = async (productId) => {
    try {
        const response = await axios.get(`${REC_API_URL}/recommend/product/${productId}`);
        return response.data.recommendations || [];
    } catch (error) {
        console.error("Failed to fetch product recommendations from AI Engine:", error);
        // Fallback to simpler category match
        try {
            const fallback = await api.get(`/products/${productId}/recommendations`);
            return fallback.data.data;
        } catch (e) {
            return [];
        }
    }
};

export const logInteraction = async (productId, action, metadata = {}) => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return; // logged out

        await api.post(`${BACKEND_API_URL}/interaction`,
            { productId, action, metadata }
        );
    } catch (error) {
        console.error("Failed to log interaction:", error);
    }
};
