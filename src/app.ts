import express, { Request, Response } from "express";
import { router } from "./app/routes";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use("/api", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;