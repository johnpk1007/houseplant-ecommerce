enum Role {
    Customer = 'CUSTOMER',
    Admin = 'ADMIN',
}

export interface AuthUser {
    email: string;
    id: number;
    role: Role
}