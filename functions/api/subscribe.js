const respond = (message, status = 200) =>
  Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });

const unavailable = () => respond('Email signups are temporarily unavailable. Please check back later.', 503);

export const onRequest = async ({ request, env }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return respond('Please use the subscription form on Return Shelf.', 403);
  }
  if (!request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded')) {
    return respond('Please use the subscription form on Return Shelf.', 415);
  }

  const payload = await request.text();
  if (payload.length > 1024) {
    return respond('Please provide a valid email address.', 400);
  }
  const email = new URLSearchParams(payload).get('email')?.trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email)) {
    return respond('Please provide a valid email address.', 400);
  }

  const { RESEND_API_KEY: apiKey, RESEND_SEGMENT_ID: segmentId } = env;
  if (!apiKey || !segmentId) return unavailable();

  const resend = (path, options = {}) => fetch(`https://api.resend.com${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(6000),
  });

  try {
    const created = await resend('/contacts', {
      method: 'POST',
      body: JSON.stringify({ email, segments: [{ id: segmentId }] }),
    });
    if (created.ok) return respond('You’re subscribed to Return Shelf updates.');
    if (created.status === 409) {
      const added = await resend(
        `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
        { method: 'POST' },
      );
      if (added.ok) return respond('You’re subscribed to Return Shelf updates.');
    }
  } catch {
    return unavailable();
  }
  return unavailable();
};
