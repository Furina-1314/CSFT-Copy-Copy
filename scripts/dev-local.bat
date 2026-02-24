@echo off
where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm 未安装，请先执行: npm i -g pnpm
  exit /b 1
)
call pnpm install
if errorlevel 1 exit /b 1
call pnpm dev
