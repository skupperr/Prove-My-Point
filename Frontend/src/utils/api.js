import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react"

export const useApi = () => {
    const { getToken } = useAuth();

    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken();

        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        const startTime = performance.now(); // Start timer
        // const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        //     ...defaultOptions,
        //     ...options
        // });

        const response = await fetch(`https://fastapi-backend-707616033952.asia-south1.run.app/api/${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        const endTime = performance.now(); // End timer
        const responseTime = endTime - startTime;
        console.log(`API response time: ${responseTime.toFixed(2)} ms`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();

    };

    return { makeRequest }
}