import { IAddress } from "../profile/iProfile";
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

interface IUserRegister {
    userRegister: {
        email: string;
        password: string;
    }
    userDetails: {
        first_name: string;
        middle_name?: string;
        last_name: string;
        email: string;
        phone: string;
        dob: string;
        doj?: string;
        gender?: string;
        profileImage?: string;
        address: IAddress;
    }
}
interface Errors {
    [key: string]: string;
}

// Fix: Change Error to Errors in exports
export type {
    FormData,
    IUserRegister,
    Errors
}
