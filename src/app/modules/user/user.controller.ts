import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
    try {
        // Logic to create a user
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Logic to get all users
        res.status(200).json({ message: "All users retrieved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
}

export const UserControllers = {
    createUser,
    getAllUsers
}