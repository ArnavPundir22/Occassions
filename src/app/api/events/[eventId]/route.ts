import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    await dbConnect();
    const { eventId } = await params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
    }

    const event = await Event.findById(eventId).populate('hostId', 'name');
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const attendeeCount = await Registration.countDocuments({ eventId });

    return NextResponse.json({ event, attendeeCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
