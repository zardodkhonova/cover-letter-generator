"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { GradientButton } from "./ui/GradientButton";

type Props = {
  /** When false, hide Login (wizard mode keeps logo minimal) */
  showLogin?: boolean;
};

export function Navbar({ showLogin = true }: Props) {
  const { isSignedIn } = useAuth();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-5 sm:px-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-violet-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
          CL
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">CoverLetter AI</span>
      </div>
      <div className="flex items-center gap-3">
        {showLogin ? (
          <>
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <GradientButton variant="ghost" className="!py-2 !text-xs">
                  Login
                </GradientButton>
              </SignInButton>
            ) : null}
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 transition-colors hover:bg-white/10"
                >
                  My Drafts
                </Link>
                <UserButton />
              </>
            ) : null}
          </>
        ) : (
          <>
            <span className="text-xs text-white/35">Draft saved locally</span>
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/85 transition-colors hover:bg-white/10"
                >
                  My Drafts
                </Link>
                <UserButton />
              </>
            ) : null}
          </>
        )}
      </div>
    </motion.header>
  );
}
