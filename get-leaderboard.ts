import type { Config } from '@netlify/functions';

export default async () => Response.json({
  configured: false,
  leaderboard: [],
  recentRuns: [],
  achievementFeed: [],
  weeklyChallenge: { name: 'Waiver Wire Madness', modifier: 'Reward rerolls +1', seed: weeklySeed() },
  message: 'League storage is not configured yet; local play remains fully available.'
});

function weeklySeed() {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - start) / 86400000 + new Date(start).getUTCDay() + 1) / 7);
  return `${now.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export const config: Config = { path: '/api/league-state' };
