import type { Config } from '@netlify/functions';
import { getSupabase } from './lib/supabase';

const classes = ['wizard','goblin','rat','necro','gremlin','commissioner'];
const cleanName=(v:unknown)=>String(v||'Anonymous Menace').replace(/[^\p{L}\p{N} _-]/gu,'').trim().slice(0,24)||'Anonymous Menace';

export default async (request: Request) => {
  if (request.method !== 'POST') return Response.json({ error:'Method not allowed' }, { status:405 });
  if (Number(request.headers.get('content-length') || 0) > 65_536) return Response.json({ error:'Payload too large' }, { status:413 });
  let body:any; try { body = await request.json(); } catch { return Response.json({ error:'Invalid JSON' }, { status:400 }); }
  const meta = body?.meta || {}, run = body?.run || {}, award = body?.award || {};
  const playerId = String(meta.playerId || '').slice(0,80);
  const classId = String(run.classId || '');
  const floor = Number(run.floor);
  if (!playerId || !classes.includes(classId) || !Number.isInteger(floor) || floor < 1 || floor > 40) return Response.json({ error:'Invalid meta payload' }, { status:400 });
  const supabase = getSupabase();
  if (!supabase) return Response.json({ accepted:true, persisted:false }, { status:202 });
  const manager = cleanName(meta.managerName);
  const safeMeta = {
    player_public_id: playerId, manager_name: manager, level: Math.max(1, Math.min(50, Number(meta.level)||1)),
    xp: Math.max(0, Number(meta.xp)||0), essence: Math.max(0, Number(meta.essence)||0),
    lifetime_runs: Math.max(0, Number(meta.lifetimeRuns)||0), best_floor: Math.max(0, Math.min(40, Number(meta.bestFloor)||0)),
    clears_18: Math.max(0, Number(meta.clears18)||0), clears_40: Math.max(0, Number(meta.clears40)||0),
    unlocked_depth: Math.max(18, Math.min(40, Number(meta.unlockedDepth)||18)), class_mastery: meta.classMastery || {},
    achievements: Array.isArray(meta.achievements) ? meta.achievements.slice(0,200) : []
  };
  const { data: profile, error: profileError } = await supabase.from('profiles').upsert({ player_public_id: playerId, manager_name: manager }, { onConflict:'player_public_id' }).select('id').single();
  if (profileError || !profile) { console.error('profile upsert failed', profileError); return Response.json({ error:'Profile sync failed' }, { status:502 }); }
  const { error: metaError } = await supabase.from('meta_progression').upsert({ profile_id: profile.id, ...safeMeta }, { onConflict:'profile_id' });
  if (metaError) { console.error('meta upsert failed', metaError); return Response.json({ error:'Meta sync failed' }, { status:502 }); }
  await supabase.from('meta_run_events').insert({ profile_id: profile.id, run_seed: Number(run.seed)||0, floor, class_id: classId, won: !!run.won, campaign_cleared: !!run.campaignCleared, duration_seconds: Math.max(0, Number(run.durationSeconds)||0), xp_awarded: Math.max(0, Number(award.xp)||0), essence_awarded: Math.max(0, Number(award.essence)||0) });
  return Response.json({ accepted:true, persisted:true }, { status:201 });
};

export const config: Config = { path:'/api/sync-meta' };

