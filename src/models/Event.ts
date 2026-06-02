import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  hostId: mongoose.Types.ObjectId;
  capacity?: number;
  cutoffDate?: Date;
  isClosed: boolean;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    capacity: { type: Number, required: false },
    cutoffDate: { type: Date, required: false },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;
