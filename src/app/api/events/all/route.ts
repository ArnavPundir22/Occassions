import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().populate('hostId', 'name').sort({ createdAt: -1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
