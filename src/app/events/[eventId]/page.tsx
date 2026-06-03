'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Clock, Info, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setAttendeeCount(data.attendeeCount);
      } else {
        toast.error('Failed to load event details');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!');
  };

  const handleRegister = async () => {
    if (status === 'unauthenticated') {
      toast('Please login to register', { icon: 'ℹ️' });
      router.push('/login');
      return;
    }

    if (session?.user.role !== 'ATTENDEE') {
      toast.error('Only attendees can register for events');
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message);
        fetchEventDetails();
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h2>
      </div>
    );
  }

  const isFull = event.capacity && attendeeCount >= event.capacity;
  const isPastDeadline = event.cutoffDate && new Date() > new Date(event.cutoffDate);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
          <h1 className="text-4xl font-extrabold mb-4">{event.title}</h1>
          <p className="text-blue-100 font-medium">Hosted by {event.hostId?.name}</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">About this Event</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Time</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Attendees</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {attendeeCount} {event.capacity ? `/ ${event.capacity}` : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              {event.isClosed ? (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">Registrations are closed for this event.</p>
                </div>
              ) : isFull ? (
                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">This event has reached its maximum capacity.</p>
                </div>
              ) : isPastDeadline ? (
                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">The registration deadline has passed.</p>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {registering ? 'Registering...' : 'Register Now'}
                </button>
              )}

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl shadow-sm transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
