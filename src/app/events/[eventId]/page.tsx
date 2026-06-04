"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Info,
  Share2,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
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
        toast.error("Failed to load event details");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Event link copied to clipboard!");
  };

  const handleRegister = async () => {
    if (status === "unauthenticated") {
      toast("Please login to register", { icon: "ℹ️" });
      router.push("/login");
      return;
    }

    if (session?.user.role !== "ATTENDEE") {
      toast.error("Only attendees can register for events");
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchEventDetails();
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred");
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Event Not Found
        </h2>
      </div>
    );
  }

  const isFull = event.capacity && attendeeCount >= event.capacity;
  const isPastDeadline =
    event.cutoffDate && new Date() > new Date(event.cutoffDate);
  const eventDateTime = new Date(`${event.date}T${event.time}`);
  const isPastEventTime = new Date() > eventDateTime;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
    overflow-hidden
    rounded-3xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-xl
    shadow-[0_10px_40px_rgba(0,0,0,0.25)]
  "
      >
        <div className="bg-gradient-to-r from-blue-600 to-violet-700 px-8 py-8 text-white">
          <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            Featured Event
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
            {event.title}
          </h1>
          <p className="mt-1 text-blue-100 font-medium">
            Hosted by {event.hostId?.name || "Host"}
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                About this Event
              </h2>
              <p className="text-zinc-300 whitespace-pre-wrap leading-8">
                {event.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="
  overflow-hidden
  rounded-2xl
  border
  border-white/10
  bg-black/20
  p-6
  space-y-5
  backdrop-blur-xl
  "
            >
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-white">Date</p>
                  <p className="text-sm text-zinc-400">
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-white">Time</p>
                  <p className="text-sm text-zinc-400">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-white">Location</p>

                  <p className="mt-1 text-sm text-zinc-400 break-all">
                    {event.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-white">Attendees</p>
                  <p className="text-sm text-zinc-400">
                    {attendeeCount}{" "}
                    {event.capacity ? `/ ${event.capacity}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              {event.isClosed ? (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">
                    Registrations are closed for this event.
                  </p>
                </div>
              ) : isFull ? (
                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">
                    This event has reached its maximum capacity.
                  </p>
                </div>
              ) : isPastDeadline ? (
                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">
                    The registration deadline has passed.
                  </p>
                </div>
              ) : isPastEventTime ? (
                <div className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 mr-2 shrink-0" />
                  <p className="text-sm font-medium">
                    This event has already started or passed.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className=" w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/40 disabled:opacity-50 "
                >
                  {registering ? "Registering..." : "Register Now"}
                </button>
              )}

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-zinc-300 transition-all hover:bg-white/10 "
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Event
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
