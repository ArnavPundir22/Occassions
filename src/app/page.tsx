'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events/all');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        toast.error('Failed to load events');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          Discover & Manage <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Events seamlessly.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          The elegant and powerful platform for hosts and attendees to connect, inspired by Luma.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
          <Calendar className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No events found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Be the first to host an event on our platform!
          </p>
          <div className="mt-6">
            <Link
              href="/register"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              Sign Up as Host
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  {event.isClosed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 shrink-0 ml-2">
                      Closed
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-750 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 mr-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{format(new Date(event.date), 'MMM d, yyyy')} • {event.time}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-750 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 mr-3 text-blue-500 shrink-0" />
                    <span className="truncate font-medium">{event.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-100 dark:border-gray-700 mt-auto flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Hosted by <span className="text-gray-900 dark:text-gray-200">{event.hostId?.name}</span>
                </span>
                <Link
                  href={`/events/${event._id}`}
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
