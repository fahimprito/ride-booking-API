import express from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideSchema, updateRideSchema } from "./ride.validation";

const router = express.Router()

router.post("/request", validateRequest(createRideSchema), checkAuth(...Object.values(Role)), RideControllers.requestRide);
router.get("/all-rides", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DRIVER), RideControllers.getAllRides);
router.get("/ride-history", checkAuth(Role.RIDER), RideControllers.getRideHistory);

router.get("/:id", checkAuth(...Object.values(Role)), RideControllers.getSingleRide);

router.patch("/accept/:id", checkAuth(Role.DRIVER), RideControllers.acceptRideRequest);
router.patch("/cancel/:id", checkAuth(...Object.values(Role)), RideControllers.cancelRide);
router.patch("/update/:id", validateRequest(updateRideSchema), checkAuth(Role.DRIVER), RideControllers.updateRide);


export const RideRoutes = router;