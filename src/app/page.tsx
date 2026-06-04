"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { format } from "date-fns";

import { Calendar, MapPin } from "lucide-react";

import toast from "react-hot-toast";

import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const mouseX = useMotionValue(0);

  const mouseY = useMotionValue(0);

  const particles = [
    { x: 120, y: 650, delay: 0, duration: 20 },

    { x: 260, y: 720, delay: 2, duration: 22 },

    { x: 420, y: 800, delay: 4, duration: 24 },

    { x: 580, y: 680, delay: 1, duration: 21 },

    { x: 740, y: 760, delay: 3, duration: 25 },

    { x: 900, y: 700, delay: 5, duration: 23 },

    { x: 1050, y: 850, delay: 2, duration: 26 },

    { x: 180, y: 900, delay: 6, duration: 22 },

    { x: 640, y: 950, delay: 7, duration: 24 },

    { x: 980, y: 880, delay: 3, duration: 21 },
  ];

  const smoothX = useSpring(mouseX, {
    stiffness: 50,

    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 50,

    damping: 20,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events/all");

      if (res.ok) {
        const data = await res.json();
        console.log("API RESPONSE:", data);

        setEvents(data);
      } else {
        toast.error("Failed to load events");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);

        mouseY.set(e.clientY);
      }}
    >
      <motion.div
        className="pointer-events-none fixed z-[1] h-[500px] w-[500px] rounded-full"
        style={{
          left: smoothX,

          top: smoothY,

          transform: "translate(-50%, -50%)",

          background:
            "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",

          filter: "blur(90px)",
        }}
      />

      {/* Hero Section */}

      <motion.div
        className="relative mb-12 overflow-hidden py-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,

          ease: "easeOut",
        }}
      >
        {/* Dot Pattern */}

        <div
          className="absolute inset-0 -z-20 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",

            backgroundSize: "32px 32px",
          }}
        />

        <div className="absolute inset-0 -z-10 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-indigo-300/40 blur-[1px]"
              initial={{
                x: particle.x,

                y: particle.y,

                opacity: 0,
              }}
              animate={{
                y: -150,

                opacity: [0, 0.6, 0],

                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: particle.duration,

                repeat: Infinity,

                delay: particle.delay,

                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Animated Background */}

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[140px]"
            animate={{
              x: [-50, 50, -50],

              y: [-30, 30, -30],
            }}
            transition={{
              duration: 25,

              repeat: Infinity,

              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute right-[10%] top-[-1px] h-[700px] w-[700px] rounded-full bg-cyan-500/15 blur-[220px]"
            animate={{
              x: [50, -50, 50],

              y: [30, -30, 30],
            }}
            transition={{
              duration: 30,

              repeat: Infinity,

              ease: "easeInOut",
            }}
          />
        </div>

        {/* Badge */}

        <motion.div
          className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ✨ Modern Event Registration Platform
        </motion.div>

        {/* Heading */}

        <motion.h1
          className="mx-auto max-w-5xl text-5xl font-bold tracking-tight text-white md:text-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,

              ease: "easeOut",
            }}
          >
            Create.
          </motion.span>

          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}
            Manage.
          </span>

          <br />

          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.4,

              duration: 0.8,

              ease: "easeOut",
            }}
          >
            Grow Communities.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,

            duration: 0.8,

            ease: "easeOut",
          }}
        >
          Host meetups, workshops, hackathons and conferences with a beautiful
        </motion.p>

        <motion.p
          className="mx-auto mt-2 max-w-2xl text-lg text-zinc-400 md:text-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.1,

            duration: 0.8,

            ease: "easeOut",
          }}
        >
          experience inspired by modern event platforms.
        </motion.p>

        {/* Buttons */}

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,

            y: 0,
          }}
          transition={{
            delay: 1.4,

            duration: 0.8,
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,

              y: -4,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              Start Hosting
            </Link>
          </motion.div>

          <motion.a
            href="#events"
            whileHover={{
              scale: 1.05,

              y: -4,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/10"
          >
            Explore Events
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        id="events"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,

          ease: "easeOut",
        }}
      >
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            Featured Events
          </div>

          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Discover Upcoming Experiences
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Join workshops, hackathons, conferences and meetups hosted by
            amazing communities.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : events.length === 0 ? (
          <motion.div
            className="text-center py-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
            }}
          >
            <Calendar className="mx-auto h-16 w-16 text-zinc-500 mb-4" />

            <h3 className="text-xl font-semibold text-white">
              No events found
            </h3>

            <p className="mt-2 text-zinc-400">
              Be the first to host an event on our platform.
            </p>

            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02]"
              >
                Sign Up as Host
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

                <div className="flex-grow p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-indigo-400">
                      {event.title}
                    </h3>

                    {event.isClosed && (
                      <span className="ml-2 shrink-0 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                        Closed
                      </span>
                    )}
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm text-zinc-400">
                    {event.description}
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center rounded-xl border border-white/5 bg-white/5 p-3">
                      <Calendar className="mr-3 h-4 w-4 shrink-0 text-indigo-400" />

                      <span className="font-medium text-zinc-300">
                        {format(new Date(event.date), "MMM d, yyyy")} •{" "}
                        {event.time}
                      </span>
                    </div>

                    <div className="flex items-center rounded-xl border border-white/5 bg-white/5 p-3">
                      <MapPin className="mr-3 h-4 w-4 shrink-0 text-cyan-400" />

                      <span className="truncate font-medium text-zinc-300">
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/10 px-6 py-4">
                  <span className="text-xs text-zinc-500">
                    Hosted by{" "}
                    <span className="text-zinc-300">{event.hostId?.name}</span>
                  </span>

                  <Link
                    href={`/events/${event._id}`}
                    className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
