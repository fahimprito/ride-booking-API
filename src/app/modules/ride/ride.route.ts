import express from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideSchema } from "./ride.validation";

const router = express.Router()

router.post("/request", validateRequest(createRideSchema), checkAuth(...Object.values(Role)), RideControllers.requestRide);
router.get("/all-rides", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), RideControllers.getAllRides);

export const RideRoutes = router;