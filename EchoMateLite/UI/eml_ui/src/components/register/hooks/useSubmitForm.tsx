import { FormData } from "../iRegister";
import axios from "axios";
import { useState } from 'react';

const baseURL = import.meta.env.EML_API_URL;

const useSubmitForm = (initialData: FormData) => {
    const [formData] = useState<FormData>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitForm = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.post('/auth/register', formData, {
                baseURL,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'An error occurred during registration');
            } else {
                setError('An unexpected error occurred');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        submitForm,
        isLoading,
        error
    };
};

export default useSubmitForm;
