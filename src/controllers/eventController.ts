import { Request, Response } from "express";
import { EventModel } from "../models/eventModel";

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
    try {
        const { userAction, timestamp, payload } = req.body;
        if (!userAction || !timestamp || !payload) {
            return res.status(400).json({
                succeed: false,
                code: 400,
                status: "Bad Request",
                message: "All fields (userAction, timestamp, payload) are required.",
            });
        }
        const event = new EventModel({
            userAction,
            timestamp,
            payload,
        });
        await event.save();
        return res.status(201).json({
            succeed: true,
            code: 201,
            status: "Event Created",
            message: "Event created successfully.",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            succeed: false,
            code: 500,
            status: "Internal Server Error",
            message: error instanceof Error ? error.message : "Error creating event.",
        });
    }
};
// Retrieve all events
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await EventModel.find().sort({ timestamp: -1 });
        return res.status(200).json({
            succeed: true,
            code: 200,
            status: "Success",
            events,
        });
    } catch (error) {
        return res.status(500).json({
            succeed: false,
            code: 500,
            status: "Internal Server Error",
            message: error instanceof Error ? error.message : "Error retrieving events.",
        });
    }
};
// Get event metrics
export const getEventMetrics = async (req: Request, res: Response) => {
    try {
        const metrics = await EventModel.aggregate([
            { $group: { _id: "$userAction", count: { $sum: 1 } } },
        ]);
        return res.status(200).json({
            succeed: true,
            code: 200,
            status: "Success",
            metrics,
        });
    } catch (error) {
        return res.status(500).json({
            succeed: false,
            code: 500,
            status: "Internal Server Error",
            message: error instanceof Error ? error.message : "Error retrieving metrics.",
        });
    }
};
