#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "Please install Node.js 20 or newer from https://nodejs.org/"
  exit 1
fi
npm install
npm run dev
