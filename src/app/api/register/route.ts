import { NextResponse } from 'next-auth/next';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { NextResponse as Response } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'ATTENDEE', // default to ATTENDEE, but HOST can be passed
    });

    return Response.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
