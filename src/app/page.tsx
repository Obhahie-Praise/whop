"use client";

import BackgroundFlare from "@/components/BackgroundFlare";
import WaitlistHeader from "@/components/WaitlistHeader";
import {
  Ambulance,
  Bot,
  Clock,
  PlusCircle,
  Radio,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { joinWaitlist } from "./actions";

const WaitlistContent = () => {
  const searchParams = useSearchParams();
  const source = searchParams ? searchParams.get("source") : null;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    const res = await joinWaitlist(email, source);
    if (res.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMessage(res.error || "Something went wrong.");
    }
  };

  return (
    <div className="pt-6 relative min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <WaitlistHeader />
      <main className="relative">
        <div className="space-y-6 pt-12">
          <div className="">
            <div className="flex gap-2 items-center font-medium text-xs backdrop-blur-lg py-1 px-3 border border-zinc-200 dark:border-zinc-800/30 rounded-lg w-fit mx-auto relative bg-zinc-50/50 dark:bg-transparent shadow-sm dark:shadow-none">
              <Twitter strokeWidth={1.6} size={18} className="text-zinc-600 dark:text-zinc-400" />{" "}
              <p className="text-zinc-600 dark:text-zinc-400">Check us out on X</p>
            </div>
          </div>
          <h1 className="text-center text-[5rem] font-medium leading-none text-zinc-900 dark:text-white">
            Early Access to Game <br /> Changing{" "}
            <span className="special-font inline-flex items-center bg-linear-to-r from-blue-500/60 to-red-500/60 bg-clip-text text-transparent relative">
              <p>Emergency Responses</p>
              <Ambulance
                size={55}
                className="text-zinc-900 dark:text-white ml-2"
              />
            </span>
          </h1>
          <p className="text-center text-lg text-zinc-500 dark:text-neutral-500 font-medium">
            Unlock exclusive early access to a ground-breaking to respond to
            emergencies! <br />
            Subscribe now and stay ahead of the future!
          </p>
          <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800/60 rounded-full w-fit mx-auto shadow-xl dark:shadow-none overflow-hidden">
            <form onSubmit={handleJoin} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="px-6 py-3 bg-transparent text-zinc-900 dark:text-white rounded-full outline-none focus:outline-none disabled:opacity-50"
                size={30}
                placeholder="Your email"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer py-3 px-8 rounded-full font-medium disabled:opacity-50 shadow-lg dark:shadow-none active:scale-95"
              >
                <PlusCircle strokeWidth={1.7} size={20} />
                <p>{status === "loading" ? "Joining..." : "Join"}</p>
              </button>
            </form>
          </div>
          {status === "error" && (
            <p className="text-red-500 text-center text-sm font-medium">{errorMessage}</p>
          )}
          <div className="flex items-center justify-center my-5">
            <div className="">
              <div className="relative">
                <div className="h-7 w-20 relative">
                  <Image
                    src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=1170&auto=format&fit=crop"
                    alt="User 1"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border border-zinc-200 dark:border-zinc-800/60 absolute top-0 left-0 object-cover"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?q=80&w=715&auto=format&fit=crop"
                    alt="User 2"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border border-zinc-200 dark:border-zinc-800/60 absolute top-0 left-4 object-cover"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1580518324671-c2f0833a3af3?q=80&w=1974&auto=format&fit=crop"
                    alt="User 3"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border border-zinc-200 dark:border-zinc-800/60 absolute top-0 left-8 object-cover"
                  />
                </div>
              </div>
              <p className="text-zinc-500 dark:text-white/40 text-sm my-2 ml-18">
                Join 500+ already onboard!
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 mx-60 mt-40 mb-20 text-zinc-900 dark:text-white">
          <div className="relative bg-zinc-50 dark:bg-neutral-700/20 backdrop-blur-2xl h-45 flex items-center justify-center border-zinc-200 dark:border-zinc-800/60 border rounded-2xl text-2xl text-center font-medium shadow-sm dark:shadow-none transition-transform hover:scale-[1.02]">
            <div className="text-white dark:text-black bg-zinc-900 dark:bg-zinc-200 p-6 rounded-full border border-white dark:border-zinc-900 absolute -top-10 left-1/2 -translate-x-1/2 shadow-xl">
              <Clock className="" strokeWidth={1.5} size={25} />
            </div>

            <p>
              Early <br /> Access
            </p>
          </div>
          <div className="relative bg-zinc-50 dark:bg-neutral-700/20 backdrop-blur-2xl h-45 flex items-center justify-center border-zinc-200 dark:border-zinc-800/60 border rounded-2xl text-2xl text-center font-medium shadow-sm dark:shadow-none transition-transform hover:scale-[1.02]">
            <div className="text-white dark:text-black bg-zinc-900 dark:bg-zinc-200 p-6 rounded-full border border-white dark:border-zinc-900 absolute -top-10 left-1/2 -translate-x-1/2 shadow-xl">
              <Radio className="" strokeWidth={1.5} size={25} />
            </div>
            <p>
              Instant <br /> Broadcasting
            </p>
          </div>
          <div className="relative bg-zinc-50 dark:bg-neutral-700/20 backdrop-blur-2xl h-45 flex items-center justify-center border-zinc-200 dark:border-zinc-800/60 border rounded-2xl text-2xl text-center font-medium shadow-sm dark:shadow-none transition-transform hover:scale-[1.02]">
            <div className="text-white dark:text-black bg-zinc-900 dark:bg-zinc-200 p-6 rounded-full border border-white dark:border-zinc-900 absolute -top-10 left-1/2 -translate-x-1/2 shadow-xl">
              <Bot className="" strokeWidth={1.5} size={25} />
            </div>
            <p>
              AI-powered <br /> Geomapping
            </p>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {status === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 shadow-2xl backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl text-center max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              You're on the list!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
              Thank you for joining. We'll be in touch soon with your early
              access.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold w-full hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-95 cursor-pointer shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      <BackgroundFlare />
    </div>
  );
};

const WaitlistPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <WaitlistContent />
    </Suspense>
  );
};

export default WaitlistPage;
