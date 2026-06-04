"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Download,
  Users,
  UserCheck,
  Gauge,
  Calendar,
  MapPin,
  Search,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";

import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function EventDashboardPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session && session.user.role !== "HOST")
    ) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchEventData();
    }
  }, [status, session, router, eventId]);

  const fetchEventData = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/attendees`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setAttendees(data.attendees);
      } else {
        toast.error("Failed to load event data");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/events/${eventId}/export`, "_blank");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied to clipboard!");
  };

  const handleDeleteEvent = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone and all registrations will be removed.",
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Event deleted successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete event");
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("An error occurred");
      setIsDeleting(false);
    }
  };

  const filteredAttendees = attendees.filter(
    (a) =>
      a.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          boxShadow: "0 0 50px rgba(99,102,241,0.12)",
        }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] mb-8"
      >
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
        <div className="p-6 md:p-8 flex flex-col xl:flex-row xl:items-start justify-between gap-6 border-b border-white/10">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4 max-w-3xl">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />{" "}
                {format(new Date(event.date), "MMM d, yyyy")} • {event.time}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {event.location}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start xl:items-end gap-3 mt-4 md:mt-0">
            <div className="flex flex-wrap gap-3">
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/dashboard/${eventId}/edit`}
                  className="flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="flex items-center rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                className="flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex items-center rounded-xl bg-indigo-500/10 px-5 py-3 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </motion.button>
            </div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/events/${eventId}`}
                className="flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10"
              >
                View Public Page
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Registered */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Registered</p>

                <UserCheck className="h-5 w-5 text-indigo-400" />
              </div>

              <h3 className="mt-3 text-3xl font-bold text-white">
                {attendees.length}
              </h3>
            </motion.div>

            {/* Capacity */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Capacity</p>

                <Gauge className="h-5 w-5 text-violet-400" />
              </div>

              <h3 className="mt-3 text-3xl font-bold text-white">
                {event.capacity || "∞"}
              </h3>
            </motion.div>

            {/* Remaining */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Remaining</p>

                <Users className="h-5 w-5 text-cyan-400" />
              </div>

              <h3 className="mt-3 text-3xl font-bold text-white">
                {event.capacity ? event.capacity - attendees.length : "∞"}
              </h3>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center text-2xl font-bold text-white"
            >
              <Users className="mr-3 h-6 w-6 text-indigo-400" />
              Attendees ({attendees.length})
            </motion.h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=" pl-10 pr-4 py-3 w-full md:w-72 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all "
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <table className="min-w-full">
              <thead className="bg-[#0B1220] border-b border-white/10">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500"
                  >
                    Registered At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/[0.03]">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-zinc-500"
                    >
                      No attendees found.
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((attendee) => (
                    <tr
                      key={attendee._id}
                      className=" transition-all duration-300 hover:bg-indigo-500/5 cursor-pointer "
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          {attendee.user?.name}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-400">
                          {attendee.user?.email}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {format(
                          new Date(attendee.registeredAt),
                          "MMM d, yyyy h:mm a",
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
