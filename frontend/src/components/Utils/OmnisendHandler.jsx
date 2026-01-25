import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { initializeOmnisend, trackPage, identifyUser } from '../../services/omnisend';

/**
 * Component to handle Omnisend lifecycle events
 * - Initializes script
 * - Tracks page views on route change
 * - Identifies user on login
 */
const OmnisendHandler = () => {
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const initialized = useRef(false);

    // Get Brand ID from Env
    const brandId = import.meta.env.VITE_OMNISEND_BRAND_ID;

    // Initialize Omnisend ONCE (Real or Mock)
    useEffect(() => {
        if (!initialized.current) {
            initializeOmnisend(brandId);
            initialized.current = true;
        }
    }, [brandId]);

    // Track Page Views on Location Change
    useEffect(() => {
        if (initialized.current) {
            trackPage();
        }
    }, [location.pathname]);

    // Identify User when authenticated
    useEffect(() => {
        if (initialized.current && isAuthenticated && user?.email) {
            identifyUser(user.email, {
                firstName: user.firstName || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
                // Add other properties if available
            });
        }
    }, [isAuthenticated, user]);

    return null; // This component does not render anything
};

export default OmnisendHandler;
