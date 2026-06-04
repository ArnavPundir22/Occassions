"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Settings,
  BarChart3,
  UserPlus,
  Activity,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session && session.user.role !== "HOST")
    ) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchEvents();
    }
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        toast.error("Failed to fetch events");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              Host Workspace
            </div>
            <motion.h1
              initial={{
                opacity: 0,
                x: -100,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="text-4xl font-bold text-white"
            >
              Welcome Back 👋
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.7,
                ease: "easeOut",
              }}
              className="mt-3 max-w-xl text-zinc-400"
            >
              Manage registrations, attendees and events from one place.
            </motion.p>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -4, 0],
            }}
            transition={{
              opacity: {
                delay: 0.8,
                duration: 0.5,
              },
              x: {
                delay: 0.8,
                duration: 0.5,
              },
              y: {
                delay: 1.5,
                duration: 2,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              },
            }}
          >
            <Link
              href="/dashboard/create-event"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.03]"
            >
              + Create Event
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Events */}
        <motion.div
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 18,
          }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Total Events</p>
            <BarChart3 className="h-5 w-5 text-indigo-400" />
          </div>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {events.length}
          </h3>
        </motion.div>

        {/* Registrations */}
        <motion.div
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 18,
          }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Registrations</p>
            <UserPlus className="h-5 w-5 text-violet-400" />
          </div>

          <h3 className="mt-3 text-3xl font-bold text-white">0</h3>
        </motion.div>

        {/* Active Events */}
        <motion.div
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 18,
          }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Active Events</p>
            <Activity className="h-5 w-5 text-cyan-400" />
          </div>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {events.filter((event) => !event.isClosed).length}
          </h3>
        </motion.div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No events
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new event.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/create-event"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" />
              New Event
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Events</h2>

              <p className="mt-1 text-zinc-400">
                Manage and monitor all hosted events.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              {events.length} Event{events.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
              >
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white line-clamp-1">
                      {event.title}
                    </h3>

                    {event.isClosed && (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                        Closed
                      </span>
                    )}
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center text-zinc-400">
                      <Calendar className="mr-3 h-4 w-4 text-indigo-400" />
                      {format(new Date(event.date), "MMM d, yyyy")} at{" "}
                      {event.time}
                    </div>

                    <div className="flex items-center text-zinc-400">
                      <MapPin className="mr-3 h-4 w-4 text-cyan-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                  <Link
                    href={`/events/${event._id}`}
                    className="text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    View Public Page
                  </Link>

                  <Link
                    href={`/dashboard/${event._id}`}
                    className="flex items-center text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
                  >
                    <Users className="mr-1 h-4 w-4" />
                    Manage
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
