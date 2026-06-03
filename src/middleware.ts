import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];

    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

    if (user === 'kr' && pwd === '20260501') {
      return NextResponse.next();
    }
  }

  //認証が失敗、または未入力の場合はダイアログを出す
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Secure Area"',
    },
  });
}

//Basic認証を適用する範囲を設定（ここではすべてのページに適用）
export const config = {
  matcher: '/:path*',
};