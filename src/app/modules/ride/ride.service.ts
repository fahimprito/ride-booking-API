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

export const RideServices = {
    requestRide,
    getAllRides
}