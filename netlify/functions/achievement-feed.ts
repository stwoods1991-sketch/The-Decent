import type { Config } from '@netlify/functions';
import { getSupabase } from './lib/supabase';

const IDS = ['first-blood', 'floor-5', 'floor-10', 'floor-15', 'clear', 'cursed', 'close-call', 'mythic'];

export default async (request: Request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  if (Number(request.headers.get('content-length') || 0) > 2048) return Response.json({ error: 'Payload too large' }, { status: 413 });

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const name = String(body.managerName || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 24);
  const achievementId = String(body.achievementId || '');
  if (!name || !IDS.includes(achievementId)) return Response.json({ error: 'Invalid achievement' }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) {
    return Response.json({ accepted: true, persisted: false, message: 'Validated; Supabase not configured yet.' }, { status: 202 });
  }

  // One feed row per (manager, achievement): first-time unlocks only. Needs the
  // unique index in phase2.sql; duplicate posts are silently ignored.
  const { error } = await supabase
    .from('achievement_feed')
    .upsert({ manager_name: name, achievement_id: achievementId }, { onConflict: 'manager_name,achievement_id', ignoreDuplicates: true });

  if (error) {
    console.error('achievement-feed insert failed', error);
    return Response.json({ error: 'Persist failed' }, { status: 502 });
  }

  return Response.json({ accepted: true, persisted: true }, { status: 201 });
};

export const config: Config = { path: '/api/achievement-feed' };
