"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setMessage("Signing in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Login failed. Check your email and password.");
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-neutral-100 p-6">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow">
          Checking login...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-neutral-100 p-4 text-neutral-950 md:p-8">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            S&P LiveTrack
          </p>
          <h1 className="mt-2 text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-neutral-600">
            Sign in to manage transport jobs and driver tracking.
          </p>

          <form onSubmit={login} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-bold uppercase text-neutral-500">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-bold uppercase text-neutral-500">
                Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-5 py-4 font-bold text-white"
            >
              Sign In
            </button>
          </form>

          {message && <p className="mt-4 text-sm font-semibold">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => signOut(auth)}
          className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-lg"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
}
