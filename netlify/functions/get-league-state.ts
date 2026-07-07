import type { Config } from '@netlify/functions';
import { getSupabase, weekWindow } from './lib/supabase';

export default async () => {
  const supabase = getSupabase();
  const week = weekWindow();
  const fallback = { name:'Waiver Wire Madness', modifier:'Reward rerolls +1', seed:week.key, featuredBoss:'The Goalie Gravekeeper' };
  if (!supabase) return Response.json({ configured:false, leaderboard:[], recentRuns:[], achievementFeed:[], weeklyChallenge:fallback });
  const [boardResult, recentResult, feedResult, challengeResult] = await Promise.all([
    supabase.from('leaderboard_entries').select('score,submitted_runs(manager_name,class_id,floor,status,duration_seconds)').eq('week_key',week.key).order('score',{ascending:false}).limit(10),
    supabase.from('submitted_runs').select('manager_name,class_id,floor,status,duration_seconds,created_at').order('created_at',{ascending:false}).limit(8),
    supabase.from('achievement_feed').select('manager_name,achievement_id,created_at').order('created_at',{ascending:false}).limit(8),
    supabase.from('weekly_challenges').select('*').eq('week_key',week.key).maybeSingle()
  ]);
  const error = boardResult.error || recentResult.error || feedResult.error || challengeResult.error;
  if (error) { console.error('league-state query failed',error); return Response.json({ error:'League data unavailable' },{status:502}); }
  const leaderboard = (boardResult.data||[]).map((row:any)=>({ manager:row.submitted_runs?.manager_name, classId:row.submitted_runs?.class_id, floor:row.submitted_runs?.floor, status:row.submitted_runs?.status, durationSeconds:row.submitted_runs?.duration_seconds, score:row.score }));
  const recentRuns = (recentResult.data||[]).map((row:any)=>({ manager:row.manager_name, classId:row.class_id, floor:row.floor, status:row.status, durationSeconds:row.duration_seconds, createdAt:row.created_at }));
  const achievementFeed = (feedResult.data||[]).map((row:any)=>({ manager:row.manager_name, achievementId:row.achievement_id, createdAt:row.created_at }));
  return Response.json({ configured:true, leaderboard, recentRuns, achievementFeed, weeklyChallenge:challengeResult.data||fallback });
};

export const config: Config = { path: '/api/league-state' };
