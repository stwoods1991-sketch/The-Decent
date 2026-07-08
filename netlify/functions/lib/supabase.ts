import { createClient, type SupabaseClient } from '@supabase/supabase-js';

declare const Netlify: { env: { get(name: string): string | undefined } };
declare const process: { env: Record<string, string | undefined> };

// Server-only client. Uses the Supabase SECRET key, which bypasses RLS —
// this is why every table has RLS on with no browser policies: the Netlify
// Functions are the only thing that can read/write, and they validate input.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const env = typeof Netlify !== 'undefined' ? Netlify.env : undefined;
  const url = env?.get('SUPABASE_URL') || process.env.SUPABASE_URL;
  const key = env?.get('SUPABASE_SECRET_KEY') || process.env.SUPABASE_SECRET_KEY;
  cached = url && key
    ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
  return cached;
}

// One week definition shared by every endpoint so they never disagree.
// week_key is the ISO date (YYYY-MM-DD) of that week's Monday, in UTC.
export function weekWindow(now: Date = new Date()) {
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7));
  monday.setUTCHours(0, 0, 0, 0);
  const end = new Date(monday);
  end.setUTCDate(end.getUTCDate() + 7);
  return { key: monday.toISOString().slice(0, 10), startsAt: monday.toISOString(), endsAt: end.toISOString() };
}

// Deterministic leaderboard score. Higher is better. Tune the weights freely.
// floor progress dominates; a victory is worth a big flat bonus; fast victories
// earn a bounded speed bonus so a clear can't be gamed into an absurd score.
export function computeScore(floor: number, status: 'victory' | 'defeat', durationSeconds: number): number {
  const base = floor * 1000;
  const victory = status === 'victory' ? 10000 : 0;
  const speed = status === 'victory' ? Math.max(0, 6000 - Math.floor(durationSeconds / 2)) : 0;
  return base + victory + speed;
}
