import type { MetaProgression, MetaRunAward, RunState } from './types';

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
        campaignCleared: !!run.campaignCleared,
      }),
    });
    if (!res.ok) return null;
    return await res.json() as SubmitResult;
  } catch {
    return null;
  }
}

export async function syncMetaProgression(meta: MetaProgression, run: RunState, award: MetaRunAward): Promise<boolean> {
  try {
    const res = await fetch('/api/sync-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta, run: { seed: run.seed, floor: run.floor, won: !!run.won, campaignCleared: !!run.campaignCleared, classId: run.hero?.classId, durationSeconds: Math.floor(run.telemetry.elapsed) }, award }),
    });
    return res.ok;
  } catch { return false; }
}

export async function fetchRemoteMeta(playerId: string): Promise<Partial<MetaProgression> | null> {
  try {
    const res = await fetch(`/api/get-meta?playerId=${encodeURIComponent(playerId)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.meta || null;
  } catch { return null; }
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
