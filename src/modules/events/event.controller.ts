import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const allEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                clubs: {
                    select: {
                        club_name: true
                    }
                },
                student: {
                    select: {
                        first_name: true,
                        last_name: true,
                    }
                }
            }
        });

        res.status(200).json({
            status: true, body: {
                message: "All events fetched successfully",
                data: events
            }
        });
    }
    catch (err: any) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const singleEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await prisma.event.findUnique({
            where: {
                event_id: parseInt(eventId)
            },
            include: {
                clubs: {
                    select: {
                        club_name: true
                    }
                },
                student: {
                    select: {
                        first_name: true,
                        last_name: true,

                    }
                },
                attendance: {
                    select: {
                        enrollment_number: true
                    }
                },
                speakers:true       
            }
        });

        res.status(200).json({
            status: true, body: {
                message: "Event data fetched successfully",
                data: event
            }
        });
    }
    catch (err: any) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const event = await prisma.event.create({
            data: req.body
        });
        res.status(200).json({
            status: true, body: {
                message: "Event created successfully",
                data: event
            }
        });
    }
    catch (err: any) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await prisma.event.update({
            where: {
                event_id: parseInt(eventId)
            },
            data: req.body
        });
        res.status(200).json({
            status: true, body: {
                message: "Event updated successfully",
                data: event
            }
        });
    }
    catch (err: any) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await prisma.event.delete({
            where: {
                event_id: parseInt(eventId)
            }
        });
        res.status(200).json({
            status: true, body: {
                message: "Event deleted successfully",
                data: event
            }
        });
    }
    catch (err: any) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
