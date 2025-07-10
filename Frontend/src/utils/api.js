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

        // const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        //     ...defaultOptions,
        //     ...options
        // });

        const response = await fetch(`https://fastapi-backend-707616033952.asia-south1.run.app/api/${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();

    };

    return { makeRequest }
}