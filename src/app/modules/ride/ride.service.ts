import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes";

const requestRide = async (payload: Partial<IRide>, userId: string) => {

    const user = await User.findById(userId);
    if (!userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "User ID is required to request a ride");
    }
    if (!user?.phone) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Ride.")
    }

    if (!payload.pickupLocation || !payload.destinationLocation) {
        throw new AppError(httpStatus.BAD_REQUEST, "Pickup and Destination locations are required");
    }

    const ride = await Ride.create([{
        rider: userId,
        status: RideStatus.REQUESTED,
        ...payload
    }]);

    return ride;
};

const getRideHistory = async (userId: string) => {
    const rides = await Ride.find({ rider: userId }).populate('driver', 'name email phone');

    if (!rides || rides.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No ride history found for this user");
    }
    const totalRides = await Ride.countDocuments({ rider: userId });

    return {
        data: rides,
        meta: {
            total: totalRides
        }
    }
};

const getAllRides = async () => {
    const rides = await Ride.find();
    const totalRides = await Ride.countDocuments();

    return {
        data: rides,
        meta: {
            total: totalRides
        }
    }
};

const cancelRide = async (rideId: string, userId: string) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride Not Found");
    }

    if (ride.rider.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to cancel this ride");
    }

    if (ride.status !== RideStatus.REQUESTED && ride.status !== RideStatus.ACCEPTED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot cancel this ride now.");
    }


    ride.status = RideStatus.CANCELLED;
    ride.isCancelled = true;
    await ride.save();

    return ride;
}

const getSingleRide = async (rideId: string) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride Not Found");
    }

    return ride;
};

const updateRide = async (rideId: string, payload: Partial<IRide>, decodedToken: JwtPayload) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride Not Found");
    }

    if (payload.status && !Object.values(RideStatus).includes(payload.status)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride status");
    }

    if (ride.rider.toString() !== decodedToken.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this ride");
    }

    if (ride.status === RideStatus.COMPLETED || ride.status === RideStatus.CANCELLED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a completed or cancelled ride");
    }

    if (payload.status === RideStatus.CANCELLED && ride.status !== RideStatus.REQUESTED && ride.status !== RideStatus.ACCEPTED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot cancel this ride now.");
    }

    if (payload.status === RideStatus.ACCEPTED && ride.status !== RideStatus.REQUESTED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride can only be accepted when it is requested");
    }

    if (payload.status === RideStatus.PICKED_UP && ride.status !== RideStatus.ACCEPTED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride can only be picked up when it is accepted");
    }

    if (payload.status === RideStatus.IN_TRANSIT && ride.status !== RideStatus.PICKED_UP) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride can only be in transit when it is picked up");
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, payload, { new: true, runValidators: true });

    return updatedRide;
};

export const RideServices = {
    requestRide,
    getAllRides,
    cancelRide,
    getSingleRide,
    updateRide,
    getRideHistory
};