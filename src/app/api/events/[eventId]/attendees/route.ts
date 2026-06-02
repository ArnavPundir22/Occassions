import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'HOST') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = await params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: 'Invalid Event ID' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (event.hostId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const registrations = await Registration.find({ eventId })
      .populate('attendeeId', 'name email')
      .sort({ createdAt: -1 });

    const attendees = registrations.map((reg) => ({
      _id: reg._id,
      user: reg.attendeeId,
      registeredAt: reg.createdAt,
    }));

    return NextResponse.json({ event, attendees }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
