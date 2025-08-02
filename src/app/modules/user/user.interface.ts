import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER",
}

// "Google", "Credential"
export interface IAuthProvider {
    provider: string;
    providerId: string;
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export enum isAvailable {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    isAvailable?: isAvailable;

    role: Role;
    auths: IAuthProvider[]
    bookings?: Types.ObjectId[]
    guides?: Types.ObjectId[]
}