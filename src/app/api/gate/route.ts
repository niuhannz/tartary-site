import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const sitePassword = process.env.SITE_PASSWORD;

    if (!sitePassword) {
      // Gate disabled — let through
      return NextResponse.json({ ok: true });
    }

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
