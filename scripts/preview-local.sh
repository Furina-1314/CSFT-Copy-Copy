#!/usr/bin/env bash
set -euo pipefail
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm 未安装。请先安装 pnpm（例如：npm i -g pnpm）"
  exit 1
fi
pnpm install
pnpm build
pnpm start
