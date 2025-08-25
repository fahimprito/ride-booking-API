/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })

});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })

});


const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })

});

const updateAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const verifiedToken = req.user as JwtPayload;

    const user = await UserServices.updateAvailability(payload, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Availability Updated Successfully",
        data: user,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const { isActive } = req.body;
    const verifiedToken = req.user as JwtPayload;

    const user = await UserServices.updateUserStatus(userId, { isActive }, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Status Updated Successfully",
        data: user,
    });
});

export const UserControllers = {
    createUser,
    getAllUsers,
    getMe,
    getSingleUser,
    updateUser,
    updateAvailability,
    updateUserStatus
};