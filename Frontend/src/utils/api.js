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

        const response = await fetch(`https://prove-my-point.onrender.com/api/${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        return response.json();
    };

    return { makeRequest }
}