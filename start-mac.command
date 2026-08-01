#!/bin/zsh
set -e

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 Node.js。请先安装 Node.js 22.13.0 或更高版本："
  echo "https://nodejs.org/"
  exit 1
fi

NODE_OK=$(node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.stdout.write(a>22 || (a===22 && b>=13) ? "yes" : "no")')
if [[ "$NODE_OK" != "yes" ]]; then
  echo "当前 Node.js 版本是 $(node -v)，项目需要 22.13.0 或更高版本。"
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "首次运行，正在安装网页依赖……"
  npm ci
fi

echo "正在启动网页：http://localhost:3000/"
npm run dev &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

sleep 4
open "http://localhost:3000/"
wait "$SERVER_PID"
