"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TrackingPage() {
  const params = useParams();
  const jobId = params.jobId;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const q = query(
      collection(db, "Jobs"),
      where("jobId", "==", jobId),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setJob(snapshot.docs[0].data());
        } else {
          setJob(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error loading live job:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [jobId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow">
          Loading transport...
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-neutral-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold">Transport not found</h1>
          <p className="mt-2 text-neutral-600">
            Please check your tracking number and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-4 text-neutral-950 md:p-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            S&P LiveTrack
          </p>
          <h1 className="mt-2 text-4xl font-bold">S&P Transports</h1>
          <p className="mt-2 text-neutral-600">
            Live transport tracking for your vehicle.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex rounded-full bg-black px-3 py-1 text-sm font-semibold text-white">
              {job.status}
            </div>

            <h2 className="text-2xl font-bold">{job.vehicle}</h2>
            <p className="mt-1 text-neutral-500">Load {job.jobId}</p>

            <div className="mt-6 rounded-2xl bg-neutral-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                Estimated delivery
              </p>
              <p className="mt-1 text-xl font-bold">{job.eta}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Current update</h3>

            {job.trackingPaused ? (
              <p className="mt-4 rounded-2xl bg-neutral-100 p-4 font-semibold">
                Location updates will resume shortly. Current ETA: {job.eta}
              </p>
            ) : (
              <div className="mt-4 rounded-2xl bg-neutral-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Approximate live location
                </p>
                <p className="mt-1 text-lg font-bold">{job.currentLocation}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Last updated: {job.lastUpdated}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
              Pickup
            </p>
            <p className="mt-2 text-lg font-semibold">{job.pickup}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
              Drop-off
            </p>
            <p className="mt-2 text-lg font-semibold">{job.dropoff}</p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl font-bold">Trip progress</h3>
            <span className="font-bold">{job.progress}%</span>
          </div>

          <div className="h-4 rounded-full bg-neutral-100">
            <div
              className="h-4 rounded-full bg-black"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
