#!/usr/bin/env bash
# Publish carousel-core to the orphan `core-dist` branch and tag core-v<version>.
# Hosts install it with: npm i "github:andifathulms/carousel-press#core-v<version>"
# Run from the repo root after `npm run core:build` (CI: .github/workflows/release-core.yml).
# PUSH=0 commits and tags locally without pushing.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
PKG="$ROOT/packages/carousel-core"
VERSION=$(node -p "require('$PKG/package.json').version")
TAG="core-v$VERSION"
SRC=$(git -C "$ROOT" rev-parse --short HEAD)

[ -z "$(git -C "$ROOT" status --porcelain)" ] || { echo "release: commit your changes first" >&2; exit 1; }
[ -f "$PKG/dist/browser.js" ] || { echo "release: run npm run core:build first" >&2; exit 1; }
if git -C "$ROOT" rev-parse -q --verify "refs/tags/$TAG" >/dev/null || git -C "$ROOT" ls-remote --exit-code --tags origin "$TAG" >/dev/null 2>&1; then
  echo "release: $TAG already exists; bump packages/carousel-core/package.json" >&2; exit 1
fi

STAGE=$(mktemp -d)
WT=$(mktemp -d)/core-dist
trap 'rm -rf "$STAGE"; git -C "$ROOT" worktree remove --force "$WT" 2>/dev/null || true' EXIT
cp "$PKG/package.json" "$PKG/README.md" "$PKG/CHANGELOG.md" "$STAGE/"
cp -R "$PKG/dist" "$PKG/fonts" "$STAGE/"
rm -f "$STAGE"/dist-smoke-*.png

git -C "$ROOT" fetch -q origin core-dist 2>/dev/null || true
if git -C "$ROOT" rev-parse -q --verify origin/core-dist >/dev/null; then
  git -C "$ROOT" worktree add -q -B core-dist "$WT" origin/core-dist
else
  git -C "$ROOT" worktree add -q --detach "$WT"
  git -C "$WT" checkout -q --orphan core-dist
fi
git -C "$WT" rm -rq --ignore-unmatch . 2>/dev/null || true
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$STAGE"/. "$WT"/
git -C "$WT" add -A
git -C "$WT" commit -q -m "carousel-core $VERSION (built from $SRC)"
git -C "$WT" tag -a "$TAG" -m "carousel-core $VERSION (built from $SRC)"
echo "release: $TAG → $(git -C "$WT" rev-parse --short HEAD) on core-dist"
if [ "${PUSH:-1}" = "1" ]; then
  git -C "$ROOT" push -q origin core-dist "refs/tags/$TAG"
  echo "release: pushed. Install with: npm i \"github:andifathulms/carousel-press#$TAG\""
fi
