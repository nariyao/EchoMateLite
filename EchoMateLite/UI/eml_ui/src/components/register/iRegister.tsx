interface FormData {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    password: string;
    confirmPassword: string;
}
interface Errors {
    [key: string]: string;
}

// Fix: Change Error to Errors in exports
export type {
    FormData,
    Errors
}
