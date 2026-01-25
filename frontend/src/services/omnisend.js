/**
 * Omnisend Integration Service
 * 
 * Handles loading the Omnisend snippet and tracking events/users.
 * Best practices for Single Page Applications (SPA) are followed.
 * 
 * FEATURES:
 * - Dynamic script loading
 * - Route tracking
 * - User identification
 * - MOCK MODE: If no Brand ID is provided, events are logged to console
 *   so you can verify integration without an API key.
 */

let isMockMode = false;

// Initialize the Omnisend script
export const initializeOmnisend = (brandId) => {
    if (!brandId) {
        console.log('%c[Omnisend] No Brand ID found. Initializing in MOCK MODE.', 'color: #10b981; font-weight: bold;');
        console.log('%c[Omnisend] Events will be logged to console instead of sent.', 'color: #6b7280');
        isMockMode = true;
        return;
    }

    // Prevent double initialization
    if (window.omnisend) return;

    // Initialize the omnisend global object
    window.omnisend = window.omnisend || [];
    window.omnisend.push(["account", brandId]);
    window.omnisend.push(["track", "$pageViewed"]);

    // Load the script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://omnisnippet1.com/inshop/launcher-v2.js";

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.head.appendChild(script);
    }
};

/**
 * Track a page view
 * call this on route changes in SPA
 */
export const trackPage = () => {
    if (window.omnisend) {
        window.omnisend.push(["track", "$pageViewed"]);
    } else if (isMockMode) {
        console.log('%c[Omnisend Mock] Track Page View: %c$pageViewed', 'color: #3b82f6', 'font-weight: bold');
    }
};

/**
 * Track a custom event
 * @param {string} eventID - The event name/ID (e.g., "viewed product", "added product to cart")
 * @param {object} properties - Additional properties for the event
 */
export const trackEvent = (eventID, properties = {}) => {
    if (window.omnisend) {
        window.omnisend.push(["track", eventID, properties]);
    } else if (isMockMode) {
        console.groupCollapsed(`%c[Omnisend Mock] Track Event: %c${eventID}`, 'color: #8b5cf6', 'font-weight: bold');
        console.log('Properties:', properties);
        console.groupEnd();
    }
};

/**
 * Identify a user
 * @param {string} email - User's email
 * @param {object} properties - Additional user properties (firstName, lastName, phone, etc.)
 */
export const identifyUser = (email, properties = {}) => {
    if (window.omnisend && email) {
        window.omnisend.identifyContact({
            email,
            ...properties
        });
    } else if (isMockMode && email) {
        console.groupCollapsed(`%c[Omnisend Mock] Identify User: %c${email}`, 'color: #f59e0b', 'font-weight: bold');
        console.log('Properties:', properties);
        console.groupEnd();
    }
};

// Export all as default object as well for convenience
export default {
    initializeOmnisend,
    trackPage,
    trackEvent,
    identifyUser
};
