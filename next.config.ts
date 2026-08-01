import type { NextConfig } from "next";

// 部署到 GitHub Pages 时，静态站挂在仓库子路径下（例如 /my_library）。
// 通过环境变量控制：
// - 本地开发：不设置 NEXT_PUBLIC_BASE_PATH，basePath 为空，访问根路径。
// - GitHub Pages 构建：设置 NEXT_PUBLIC_BASE_PATH=/my_library。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // 静态导出：构建时把所有页面渲染成静态 HTML，输出到 out/ 目录。
  output: "export",
  // 静态站没有图片优化服务，原图直接输出。
  images: { unoptimized: true },
  // GitHub Pages 项目页挂在子路径下，需要前缀所有资源与路由。
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  trailingSlash: true,
};

export default nextConfig;
