import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, isAvailable, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    // user exist check
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    // hashed password 
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: email as string
    }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user;
}

const getAllUsers = async () => {
    const users = await User.find();

    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};


// update user
const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }


    if (payload.role) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change role");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to make super admin");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser;
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    return {
        data: user
    }
};

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const updateAvailability = async (payload: { isAvailable: isAvailable }, decodedToken: JwtPayload) => {
    if (decodedToken.role !== Role.DRIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update availability");
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    user.isAvailable = payload.isAvailable;
    await user.save();

    return user;
}

const updateUserStatus = async (userId: string, payload: { isActive: IsActive }, decodedToken: JwtPayload) => {
    if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update user status");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    user.isActive = payload.isActive;
    await user.save();

    return user;
}

export const UserServices = {
    createUser,
    getAllUsers,
    getMe,
    updateUser,
    getSingleUser,
    updateAvailability,
    updateUserStatus
};