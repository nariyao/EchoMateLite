import { FormData, IUserRegister } from "../iRegister";
import axios from "axios";
import { useState } from 'react';

// Renamed to follow React hook naming convention
const formatFormData = (formData: FormData): IUserRegister => {
    return {
        userRegister: {
            email: formData.email,
            password: formData.password
        },
        userDetails: {
            first_name: formData.firstName,
            middle_name: formData.middleName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            address: {
                line1: formData.line1,
                line2: formData.line2,
                city: formData.city,
                state: formData.state,
                country: formData.country
            }
        }
    };
};

// Renamed to follow React hook naming convention
const useSubmitForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitForm = async (formData: FormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const formattedData = formatFormData(formData);

            const response = await axios.post('/auth/register', formattedData, {
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
