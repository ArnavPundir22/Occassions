import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'HOST') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const events = await Event.find({ hostId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'HOST') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, date, time, location, capacity, cutoffDate } = body;

    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      capacity: capacity ? Number(capacity) : undefined,
      cutoffDate: cutoffDate ? new Date(cutoffDate) : undefined,
      hostId: new mongoose.Types.ObjectId(session.user.id),
      isClosed: false,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
