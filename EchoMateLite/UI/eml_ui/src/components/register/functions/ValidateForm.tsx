import { FormData, Errors } from "../iRegister";

const ValidateForm = (formData: FormData): Errors => {

    const newErrors: Errors = {};
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    else if (calculateAge(formData.dob) < 16)
        newErrors.dob = "You must be at least 16 years old";
    if (!formData.line1) newErrors.line1 = "Line 1 is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
        newErrors.password =
            "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    return newErrors
}

export default ValidateForm;