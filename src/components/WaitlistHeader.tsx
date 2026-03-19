import { useTheme } from "next-themes";
import { Moon, Sun, Twitter } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const WaitlistHeader = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) {
    return (
      <header className="mt-10 flex items-center justify-between bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-900 dark:border-zinc-900 w-full rounded-full p-1 shadow-lg shadow-zinc-900/60">
        <div className="rounded-full">
          <Image
            src={"/whop-logo.jpeg"}
            alt="whop-logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="p-3 bg-zinc-700/20 rounded-full w-10 h-10" />
      </header>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <header className="mt-10 flex items-center justify-between rounded-full max-w-full mx-4 md:mx-20 p-1">
      <div className="rounded-full">
        <Image
          src={"/whop-logo.jpeg"}
          alt="whop-logo"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>
      <div className="flex space-x-2">
        <Link href="/" className="flex items-center gap-2 px-4 md:px-6 py-1.5 transition-colors rounded-full text-black bg-zinc-100 dark:bg-zinc-700/20 dark:text-white border-zinc-200 dark:border-zinc-700/30 hover:border-zinc-300 dark:hover:border-zinc-700 border">
          <p className="hidden sm:block">Check us out on </p>
          <Twitter size={20} strokeWidth={1.4} />
        </Link>
        {/* theme changing container */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-3 bg-zinc-100 dark:bg-zinc-700/20 hover:bg-zinc-200 dark:hover:bg-zinc-700/40 transition-colors rounded-full cursor-pointer"
          aria-label="Toggle Theme"
        >
          <div className="text-zinc-900 dark:text-white">
            {isDark ? (
              <Sun size={18} strokeWidth={1.5} fill="currentColor" />
            ) : (
              <Moon size={18} strokeWidth={1.5} fill="currentColor" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default WaitlistHeader;
