import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'HOST') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { eventId } = await params;

    const event = await Event.findById(eventId);
    if (!event || event.hostId.toString() !== session.user.id) {
      return new NextResponse('Not found or unauthorized', { status: 404 });
    }

    const registrations = await Registration.find({ eventId })
      .populate('attendeeId', 'name email')
      .sort({ createdAt: -1 });

    let csv = 'Name,Email,Registered At\n';
    registrations.forEach((reg) => {
      const user = reg.attendeeId as any;
      if (user) {
        const name = `"${(user.name || '').replace(/"/g, '""')}"`;
        const email = `"${(user.email || '').replace(/"/g, '""')}"`;
        const date = `"${new Date(reg.createdAt).toISOString()}"`;
        csv += `${name},${email},${date}\n`;
      }
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.csv"`,
      },
    });
  } catch (error: any) {
    return new NextResponse('Server error', { status: 500 });
  }
}
