import express, { Router } from "express";
import * as eventController from "./event.controller";
import * as eventSchema from "./event.schema";
import { validateRequestBody } from "../../utils/zodValidation";

const router: Router = express.Router();

router.get("/", eventController.allEvents);

router.get("/:eventId", eventController.singleEvent);

router.post("/", validateRequestBody(eventSchema.createEventSchema), eventController.createEvent);

router.put("/:eventId",validateRequestBody(eventSchema.createEventSchema), eventController.updateEvent);

router.delete("/:eventId", eventController.deleteEvent);

export default router;