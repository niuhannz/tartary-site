import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    // Hardcoded fallback mirrors middleware — ensures gate works
    // even if the env var fails to inline at build time.
    const sitePassword = process.env.SITE_PASSWORD || 'tartary2025';

    if (password !== sitePassword) {
      return NextResponse.json(
        { ok: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set HttpOnly cookie that lasts 30 days
    const response = NextResponse.json({ ok: true });
    response.cookies.set('tartary-gate', 'authorized', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Bad request' },
      { status: 400 }
    );
  }
}
