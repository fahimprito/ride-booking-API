/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const requestRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const rideData = req.body;

    const ride = await RideServices.requestRide(rideData, decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Ride Requested Successfully",
        data: ride,
    })

});

const getRideHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await RideServices.getRideHistory(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride History Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
});

const getEarningHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await RideServices.getEarningHistory(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Earning History Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
});

const getAllRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user as JwtPayload;
    const result = await RideServices.getAllRides(verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Rides Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
});


const cancelRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const userId = (req.user as JwtPayload).userId;

    const ride = await RideServices.cancelRide(rideId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Cancelled Successfully",
        data: ride,
    })
});

const getSingleRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const ride = await RideServices.getSingleRide(rideId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Retrieved Successfully",
        data: ride,
    })
});

const updateRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user as JwtPayload;

    const ride = await RideServices.updateRide(rideId, payload, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Updated Successfully",
        data: ride,
    })
});

const acceptRideRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const verifiedToken = req.user as JwtPayload;

    const ride = await RideServices.acceptRideRequest(rideId, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Ride Request Accepted Successfully",
        data: ride,
    })
});

export const RideControllers = {
    requestRide,
    getAllRides,
    cancelRide,
    getSingleRide,
    updateRide,
    getRideHistory,
    acceptRideRequest,
    getEarningHistory
};
