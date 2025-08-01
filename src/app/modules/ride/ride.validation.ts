import { z } from "zod";
import { RideStatus } from "./ride.interface";

export const createRideSchema = z.object({
    pickupLocation: z.string().min(1, "Pickup location is required"),
    destinationLocation: z.string().min(1, "Destination location is required"),
    driver: z.string().optional(),
    fare: z.number().optional(),
});

export const updateRideSchema = z.object({
    rideId: z.string().min(1, "Ride ID is required"),
    status: z.enum(Object.values(RideStatus) as [string]),
    driver: z.string().optional(),
    fare: z.number().optional(),
});