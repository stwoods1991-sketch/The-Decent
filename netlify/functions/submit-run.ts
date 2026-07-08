import type { Config } from '@netlify/functions';
import { computeScore, getSupabase, weekWindow } from './lib/supabase';

const classes = ['wizard','goblin','rat','necro','gremlin','commissioner'];

export default async (request: Request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  if (Number(request.headers.get('content-length') || 0) > 16_384) return Response.json({ error: 'Payload too large' }, { status: 413 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.managerName || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 24);
    const floor = Number(body.floor);
    const durationSeconds = Number(body.durationSeconds);
    const classId = String(body.classId);
    const status = String(body.status) as 'victory'|'defeat';
    if (!name || !Number.isInteger(floor) || floor < 1 || floor > 40 || !Number.isInteger(durationSeconds) || durationSeconds < 0 || durationSeconds > 86_400 || !classes.includes(classId) || !['victory','defeat'].includes(status)) {
      return Response.json({ error: 'Invalid run submission' }, { status: 400 });
    }
    const supabase = getSupabase();
    if (!supabase) return Response.json({ accepted: true, persisted: false, message: 'Validated; Supabase is not configured.' }, { status: 202 });
    const week = weekWindow();
    const score = computeScore(floor, status, durationSeconds);
    const { data: run, error: runError } = await supabase.from('submitted_runs').insert({
      manager_name: name, class_id: classId, status, floor, duration_seconds: durationSeconds,
      score, week_key: week.key,
      summary: { classId, status, floor, campaignCleared: !!body.campaignCleared }
    }).select('id').single();
    if (runError || !run) { console.error('run insert failed', runError); return Response.json({ error: 'Run persistence failed' }, { status: 502 }); }
    const { error: boardError } = await supabase.from('leaderboard_entries').insert({ run_id: run.id, score, week_key: week.key });
    if (boardError) { console.error('leaderboard insert failed', boardError); return Response.json({ error: 'Leaderboard persistence failed' }, { status: 502 }); }
    return Response.json({ accepted: true, persisted: true, score, weekKey: week.key }, { status: 201 });
  } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
};

export const config: Config = { path: '/api/submit-run' };
