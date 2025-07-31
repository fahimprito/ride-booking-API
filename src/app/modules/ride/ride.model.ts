import { Schema, model } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const rideSchema = new Schema<IRide>(
    {
        rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
        driver: { type: Schema.Types.ObjectId, ref: "User", default: null },
        pickupLocation: { type: String, required: true },
        destinationLocation: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.REQUESTED,
        },

        fare: { type: Number },
        isCancelled: { type: Boolean, default: false },

        timestamps: {
            requestedAt: { type: Date, default: Date.now },
            acceptedAt: { type: Date },
            pickedUpAt: { type: Date },
            completedAt: { type: Date },
            cancelledAt: { type: Date },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Ride = model<IRide>("Ride", rideSchema);
