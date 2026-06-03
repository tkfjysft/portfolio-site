import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    
    // 「ユーザー名」と「パスワード」
    const USERNAME = 'kr'; 
    const PASSWORD = '20260501'; 

    const expectedAuthValue = btoa(`${USERNAME}:${PASSWORD}`);

    if (authValue === expectedAuthValue) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// すべてのページ（リライト先含む）に強制適用
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};