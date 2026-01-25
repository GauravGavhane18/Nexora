import api from './api';

// Python Microservice URL (keep for other things if needed, or remove if unused)
const REC_API_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
// Node Backend URL (proxied via /api)
// Node Backend URL (proxied via /api)
const BACKEND_API_URL = '/analytics';

export const getHomeRecommendations = async (userId) => {
    try {
        // Keeping this as is for now, or fallback to products?
        // Assuming the user only cared about product pages for now.
        const response = await api.get(`/products?limit=4`);
        return response.data.data.products;
    } catch (error) {
        console.error("Failed to fetch home recommendations:", error);
        return [];
    }
};

export const getProductRecommendations = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}/recommendations`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch product recommendations:", error);
        return [];
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
