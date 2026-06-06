'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          <Link
            href="/"
            className="group flex items-center gap-2"
          >
            <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_20px_#6366f1]" />
            <span className="text-xl font-bold tracking-tight text-white">
              Occassions
            </span>
          </Link>

          <div className="flex items-center gap-3">

            {session ? (
              <>
                <span className="hidden md:block text-sm text-zinc-400">
                  Hello, {session.user?.name}
                </span>

                {session.user?.role === 'HOST' ? (
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/attendee/my-events"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                  >
                    My Events
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-all hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  Log In
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
