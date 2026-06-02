import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ATTENDEE') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const registrations = await Registration.find({ attendeeId: session.user.id })
      .populate('eventId')
      .sort({ createdAt: -1 });

    const registeredEvents = registrations.map((reg) => reg.eventId).filter(Boolean);

    return NextResponse.json(registeredEvents, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
