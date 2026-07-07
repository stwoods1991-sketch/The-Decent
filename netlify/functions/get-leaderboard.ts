import type { Config } from '@netlify/functions';

export default async () => Response.json({ configured:false, entries:[], message:'Leaderboard persistence coming in Phase 2.' });
export const config: Config = { path:'/api/leaderboard' };
