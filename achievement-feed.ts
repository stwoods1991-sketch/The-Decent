import type { Config } from '@netlify/functions';

export default async () => { const now=new Date(); const monday=new Date(now); monday.setUTCDate(now.getUTCDate()-((now.getUTCDay()+6)%7)); monday.setUTCHours(0,0,0,0); const end=new Date(monday); end.setUTCDate(end.getUTCDate()+7); return Response.json({name:'Waiver Wire Madness',seed:monday.toISOString().slice(0,10),modifier:'One extra reroll token',featuredBoss:'The Goalie Gravekeeper',lootTheme:'Waiver salvage',startDate:monday.toISOString(),endDate:end.toISOString()}); };
export const config: Config={path:'/api/weekly-dungeon'};
