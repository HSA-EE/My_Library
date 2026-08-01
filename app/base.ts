// GitHub Pages 部署时，静态站挂在仓库子路径下（如 /my_library）。
// 本地开发时该值为空，两种场景下资源路径都能正确拼接。
// 该变量在构建时由 Next.js 内联进客户端代码，需以 NEXT_PUBLIC_ 开头。
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// 给以 / 开头的资源路径加上 basePath 前缀。
export function withBase(path: string): string {
  return BASE_PATH ? `${BASE_PATH}${path}` : path;
}
