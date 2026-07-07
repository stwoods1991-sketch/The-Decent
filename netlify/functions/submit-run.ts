import type { Config } from '@netlify/functions';

const classes = ['wizard','goblin','rat','necro','gremlin','commissioner'];

export default async (request: Request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  if (Number(request.headers.get('content-length') || 0) > 16_384) return Response.json({ error: 'Payload too large' }, { status: 413 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.managerName || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 24);
    const floor = Number(body.floor);
    if (!name || !Number.isInteger(floor) || floor < 1 || floor > 18 || !classes.includes(String(body.classId)) || !['victory','defeat'].includes(String(body.status))) {
      return Response.json({ error: 'Invalid run submission' }, { status: 400 });
    }
    return Response.json({ accepted: true, persisted: false, message: 'Validated locally; Supabase persistence is not configured yet.' }, { status: 202 });
  } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
};

export const config: Config = { path: '/api/submit-run' };
