'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'ATTENDEE')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchMyEvents();
    }
  }, [status, session, router]);

  const fetchMyEvents = async () => {
    try {
      const res = await fetch('/api/attendee/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        toast.error('Failed to fetch your events');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Registered Events</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Events you are currently registered to attend.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No registrations yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You haven't registered for any events.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-4">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {format(new Date(event.date), 'MMM d, yyyy')} at {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                <Link
                  href={`/events/${event._id}`}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Event Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
