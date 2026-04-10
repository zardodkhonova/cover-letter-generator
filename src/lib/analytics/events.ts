"use client";

import { track } from "@vercel/analytics";

export function trackAction(name: string, props?: Record<string, string | number | boolean>) {
  track(name, props);
}
