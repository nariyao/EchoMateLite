interface IAddress {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
}

interface IUser {
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

export type {
    IUser,
    IAddress
}

