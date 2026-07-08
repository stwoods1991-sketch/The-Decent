import type { Config } from '@netlify/functions';
import { getSupabase } from './lib/supabase';

export default async (request: Request) => {
  const playerId = new URL(request.url).searchParams.get('playerId')?.slice(0,80);
  if (!playerId) return Response.json({ error:'Missing playerId' }, { status:400 });
  const supabase = getSupabase();
  if (!supabase) return Response.json({ configured:false, meta:null }, { status:202 });
  const { data, error } = await supabase.from('meta_progression').select('*').eq('player_public_id', playerId).maybeSingle();
  if (error) { console.error('meta fetch failed', error); return Response.json({ error:'Meta unavailable' }, { status:502 }); }
  if (!data) return Response.json({ configured:true, meta:null });
  return Response.json({ configured:true, meta:{
    playerId:data.player_public_id, managerName:data.manager_name, level:data.level, xp:data.xp, essence:data.essence,
    lifetimeRuns:data.lifetime_runs, bestFloor:data.best_floor, clears18:data.clears_18, clears40:data.clears_40,
    unlockedDepth:data.unlocked_depth, classMastery:data.class_mastery, achievements:data.achievements, updatedAt:data.updated_at
  }});
};

export const config: Config = { path:'/api/get-meta' };

