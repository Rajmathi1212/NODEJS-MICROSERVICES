import { Schema, model, Document } from "mongoose";

interface Event extends Document {
    userAction: string;
    timestamp: Date;
    payload: Record<string, any>;
}

const EventSchema = new Schema<Event>({
    userAction: { type: String, required: true },
    timestamp: { type: Date, required: true },
    payload: { type: Object, required: true },
});

export const EventModel = model<Event>("Event", EventSchema);