import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') // favicon.ico や画像ファイルなど
  ) {
    return NextResponse.next();
  }

  // 🔒 ここから下がBasic認証のチェック
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    
    const USERNAME = 'kr'; 
    const PASSWORD = '20260501'; 

    const expectedAuthValue = btoa(`${USERNAME}:${PASSWORD}`);

    if (authValue === expectedAuthValue) {
      return NextResponse.next();
    }
  }

  // 認証がまだ、または間違っている場合はダイアログを出す
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Secure Area"',
    },
  });
}

//matcher（条件）は使わず、すべてのリクエストを一度このミドルウェアに通す