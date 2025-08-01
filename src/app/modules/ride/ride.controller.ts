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



const getAllRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideServices.getAllRides();

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

export const RideControllers = {
    requestRide,
    getAllRides,
    cancelRide
};
