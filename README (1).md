import type { RunState } from './types';

// Best-effort league calls. Everything fails soft: if the backend is
// unreachable (offline, or Supabase not configured), the game keeps working.

export interface SubmitResult { accepted: boolean; persisted: boolean; score?: number; weekKey?: string }

export async function submitRun(run: RunState): Promise<SubmitResult | null> {
  const h = run.hero;
  if (!h) return null;
  try {
    const res = await fetch('/api/submit-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        managerName: h.name,
        classId: h.classId,
        floor: run.floor,
        status: run.won ? 'victory' : 'defeat',
        durationSeconds: Math.floor(run.telemetry.elapsed),
      }),
    });
    if (!res.ok) return null;
    return await res.json() as SubmitResult;
  } catch {
    return null;
  }
}

export async function fetchLeagueState(): Promise<any | null> {
  try {
    const res = await fetch('/api/league-state');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function postAchievement(managerName: string, achievementId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/achievement-feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ managerName, achievementId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
