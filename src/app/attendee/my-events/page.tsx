"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Eye,
  ArrowLeft,
  Ticket,
  Clock3,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session && session.user.role !== "ATTENDEE")
    ) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchMyEvents();
    }
  }, [status, session, router]);

  const fetchMyEvents = async () => {
    try {
      const res = await fetch("/api/attendee/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        toast.error("Failed to fetch your events");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
  <div className="relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute left-[-200px] top-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[150px]" />
    <div className="absolute right-[-200px] bottom-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[150px]" />

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
        className="mb-10"
      >
        <h1 className="text-5xl font-bold text-white">
          My Registered Events
        </h1>

        <p className="mt-3 text-zinc-400">
          Manage and view all events you've registered for.
        </p>
      </motion.div>

      {/* Stats */}
      {events.length > 0 && (
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              y: -3,
              scale: 1.01,
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Registered Events
              </p>

              <Ticket className="h-5 w-5 text-indigo-400" />
            </div>

            <h3 className="mt-2 text-3xl font-bold text-white">
              {events.length}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Total registrations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{
              y: -3,
              scale: 1.01,
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Upcoming
              </p>

              <Clock3 className="h-5 w-5 text-violet-400" />
            </div>

            <h3 className="mt-2 text-3xl font-bold text-white">
              {
                events.filter(
                  (e) => new Date(e.date) > new Date()
                ).length
              }
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Future events
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{
              y: -3,
              scale: 1.01,
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                This Month
              </p>

              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>

            <h3 className="mt-2 text-3xl font-bold text-white">
              {
                events.filter(
                  (e) =>
                    new Date(e.date).getMonth() ===
                    new Date().getMonth()
                ).length
              }
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Current month
            </p>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-xl">
          <Calendar className="mx-auto h-14 w-14 text-indigo-400" />

          <h3 className="mt-4 text-xl font-semibold text-white">
            No registrations yet
          </h3>

          <p className="mt-2 text-zinc-400">
            You haven't registered for any events.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-white shadow-lg shadow-indigo-500/20"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div
          className={`flex flex-wrap gap-6 ${
            events.length === 1
              ? "justify-center"
              : "justify-start"
          }`}
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                boxShadow:
                  "0 0 40px rgba(99,102,241,0.15)",
              }}
              className="
                w-full
                sm:w-[420px]
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                shadow-[0_10px_40px_rgba(0,0,0,0.25)]
              "
            >
              <div className="p-6">
                <div className="mb-5 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

                <div className="mb-4 flex gap-2">
                  <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <Ticket className="mr-1 h-3 w-3" />
                    Registered
                  </div>

                  <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                    {format(
                      new Date(event.date),
                      "MMM d"
                    )}
                  </div>
                </div>

                <h3 className="mb-5 min-h-[60px] text-xl font-bold text-white line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-3 text-sm text-zinc-400">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                    {format(
                      new Date(event.date),
                      "MMM d, yyyy"
                    )}{" "}
                    at {event.time}
                  </div>

                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-indigo-400" />
                    <span className="truncate">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 px-6 py-4">
                <Link
                  href={`/events/${event._id}`}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-500/10
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-indigo-300
                    transition-all
                    hover:bg-indigo-500/20
                    hover:shadow-lg
                    hover:shadow-indigo-500/20
                  "
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Event Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  </div>
);
}
