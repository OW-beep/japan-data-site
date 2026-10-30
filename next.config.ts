/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 「人口密度が低い自治体ランキング」は、人口密度ランキングの後半に統合した
      {
        source: "/ranking/sparse-density",
        destination: "/ranking/density#low",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
