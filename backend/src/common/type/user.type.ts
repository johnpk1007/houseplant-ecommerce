enum Role {
    Customer = 'CUSTOMER',
    Admin = 'ADMIN',
}

export type AuthUser = {
    email: string;
    id: number;
    role: Role
}

export type GoogleAuthUser = AuthUser & { kind: 'AUTH' };
export type PreGoogleAuthUser = { email: string, kind: 'PRE_AUTH' };