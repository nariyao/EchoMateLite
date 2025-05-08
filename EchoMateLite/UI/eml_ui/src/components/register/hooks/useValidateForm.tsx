import { FormData, Errors } from "../iRegister";

// Convert to a proper React hook that returns a validation function
const useValidateForm = () => {
    // Move these constants outside the returned function to avoid recreating them on each validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    // Return a function that performs the validation
    return (formData: FormData): Errors => {
        const errors: Errors = {};

        // Required field validations
        const requiredFields: Array<{ key: keyof FormData, message: string }> = [
            { key: 'firstName', message: 'First name is required' },
            { key: 'lastName', message: 'Last name is required' },
            { key: 'email', message: 'Email is required' },
            { key: 'phone', message: 'Phone number is required' },
            { key: 'line1', message: 'Line 1 is required' },
            { key: 'city', message: 'City is required' },
            { key: 'state', message: 'State is required' },
            { key: 'country', message: 'Country is required' }
        ];

        // Check all required fields
        requiredFields.forEach(({ key, message }) => {
            if (!formData[key]) errors[key] = message;
        });

        // Special validations
        if (!formData.dob) {
            errors.dob = "Date of birth is required";
        } else if (calculateAge(formData.dob) < 16) {
            errors.dob = "You must be at least 16 years old";
        }

        // Password validation
        if (!formData.password) {
            errors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            errors.password = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };
};

export default useValidateForm;
