export type Params = [
    { key: number, value: string | number }
]

export type ProfileEditFormState = {
    first_name: string;
    last_name: string;
    phone: string;
    bio: string;
    company_name: string;
    commercialRegister: File | null;
    dateOfBirth: string;
    gender: string;
    picture: File | null;
};