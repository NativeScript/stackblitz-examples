#!/usr/bin/env bash
# Installs and bundles an extracted example for iOS and Android.
# Works on a copy so the extracted folder stays publishable (no node_modules).
#
#   tools/scripts/verify-example.sh <extractedDir>
set -euo pipefail

src="$(cd "$1" && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cp -R "$src"/. "$work"
cd "$work"

npm install --no-audit --no-fund
for platform in ios android; do
  npx nativescript-webpack build --env.platform="$platform"
done

echo "verified: $src"
