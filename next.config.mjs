/** @type {import('next').NextConfig} */
const nextConfig = {
//   output: 'export', // これを追加
  images: {
    unoptimized: true, // これを追加（画像をサーバーなしで表示するため）
  },
};

export default nextConfig;