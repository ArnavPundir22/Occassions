import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ATTENDEE') {
      return NextResponse.json({ message: 'You must log in as an attendee to register.' }, { status: 401 });
    }

    const { eventId } = await params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (event.isClosed) {
      return NextResponse.json({ message: 'Registrations are closed for this event.' }, { status: 400 });
    }

    if (event.cutoffDate && new Date() > new Date(event.cutoffDate)) {
      return NextResponse.json({ message: 'Registration deadline has passed.' }, { status: 400 });
    }

    if (event.capacity) {
      const attendeeCount = await Registration.countDocuments({ eventId });
      if (attendeeCount >= event.capacity) {
        return NextResponse.json({ message: 'Event is fully booked.' }, { status: 400 });
      }
    }

    const newRegistration = await Registration.create({
      eventId: new mongoose.Types.ObjectId(eventId),
      attendeeId: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json({ message: 'Successfully registered!' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'You are already registered for this event.' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
