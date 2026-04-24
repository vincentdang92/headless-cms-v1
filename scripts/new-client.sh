#!/usr/bin/env bash
# new-client.sh — Bootstrap a new client project from the headless-cms-v1 starter kit
# Usage: ./scripts/new-client.sh <client-name> <industry> [wp-url]
# Example: ./scripts/new-client.sh abc-law law https://cms.abclaw.vn

set -euo pipefail

# ─── Args ─────────────────────────────────────────────────────────────────────
CLIENT_NAME="${1:-}"
INDUSTRY="${2:-law}"
WP_URL="${3:-https://cms.example.com}"

VALID_INDUSTRIES="law tech healthcare realestate education food"

usage() {
  echo "Usage: $0 <client-name> <industry> [wp-url]"
  echo ""
  echo "Industries: $VALID_INDUSTRIES"
  echo ""
  echo "Example:"
  echo "  $0 abc-legal law https://cms.abclaw.vn"
  exit 1
}

if [[ -z "$CLIENT_NAME" ]]; then
  echo "ERROR: client-name is required"
  usage
fi

if ! echo "$VALID_INDUSTRIES" | grep -qw "$INDUSTRY"; then
  echo "ERROR: Unknown industry '$INDUSTRY'. Valid: $VALID_INDUSTRIES"
  usage
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STARTER_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="$(cd "$STARTER_DIR/.." && pwd)/${CLIENT_NAME}"

echo ""
echo "════════════════════════════════════════════"
echo "  Headless CMS — New Client Bootstrap"
echo "════════════════════════════════════════════"
echo "  Client  : $CLIENT_NAME"
echo "  Industry: $INDUSTRY"
echo "  WP URL  : $WP_URL"
echo "  Target  : $TARGET_DIR"
echo "════════════════════════════════════════════"
echo ""

# ─── Guard: target must not exist ─────────────────────────────────────────────
if [[ -d "$TARGET_DIR" ]]; then
  echo "ERROR: Directory already exists: $TARGET_DIR"
  exit 1
fi

# ─── 1. Copy starter ──────────────────────────────────────────────────────────
echo "▶ Copying starter kit..."
cp -r "$STARTER_DIR" "$TARGET_DIR"

# Remove things that shouldn't be copied
rm -rf \
  "$TARGET_DIR/.next" \
  "$TARGET_DIR/node_modules" \
  "$TARGET_DIR/tsconfig.tsbuildinfo" \
  "$TARGET_DIR/scripts" \
  "$TARGET_DIR/.git"

# ─── 2. Write .env.local ──────────────────────────────────────────────────────
echo "▶ Writing .env.local..."
cat > "$TARGET_DIR/.env.local" <<ENV
WORDPRESS_API_URL=${WP_URL}/wp-json
REVALIDATION_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_SITE_URL=https://${CLIENT_NAME}.vn
ENV

# ─── 3. Write site.config.ts ──────────────────────────────────────────────────
echo "▶ Writing site.config.ts..."
cat > "$TARGET_DIR/site.config.ts" <<TS
// Site config for ${CLIENT_NAME} — ${INDUSTRY} template
// For reference only — app reads from env vars and src/config/defaults.ts

export const SITE_CONFIG = {
  industry: '${INDUSTRY}' as const,
  clientName: '${CLIENT_NAME}',
}
TS

# ─── 4. Set industry preset in defaults.ts ────────────────────────────────────
echo "▶ Applying ${INDUSTRY} preset to defaults.ts..."

# Swap the active preset reference (sed in-place)
DEFAULTS_FILE="$TARGET_DIR/src/config/defaults.ts"

# Replace the DEFAULT_SITE_SETTINGS export to point to the chosen industry preset
if grep -q "activePreset = PRESETS" "$DEFAULTS_FILE" 2>/dev/null; then
  # Already has preset switcher — just update the key
  sed -i.bak "s/PRESETS\['[a-z]*'\]/PRESETS['${INDUSTRY}']/" "$DEFAULTS_FILE" && rm -f "${DEFAULTS_FILE}.bak"
else
  # Append preset override at the bottom
  cat >> "$DEFAULTS_FILE" <<TS


// Auto-applied by new-client.sh — override DEFAULT_SITE_SETTINGS with industry preset
const activePreset = PRESETS['${INDUSTRY}']
if (activePreset) {
  Object.assign(DEFAULT_SITE_SETTINGS.colors, activePreset.colors)
  DEFAULT_SITE_SETTINGS.headingFont = activePreset.headingFont
  DEFAULT_SITE_SETTINGS.bodyFont = activePreset.bodyFont
}
TS
fi

# ─── 5. Init git ──────────────────────────────────────────────────────────────
echo "▶ Initialising git repository..."
cd "$TARGET_DIR"
git init -q
git add -A
git commit -q -m "chore: bootstrap ${CLIENT_NAME} from headless-cms-v1 (${INDUSTRY} template)"

# ─── 6. Install deps ──────────────────────────────────────────────────────────
echo "▶ Installing dependencies (npm install)..."
npm install --silent

# ─── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "✅  Done! Project ready at: $TARGET_DIR"
echo ""
echo "Next steps:"
echo "  1. cd ../${CLIENT_NAME}"
echo "  2. Update .env.local with real WP_URL and REVALIDATE_SECRET"
echo "  3. npm run dev"
echo "  4. Configure ACF fields in WordPress (see docs/SETUP.md)"
echo "  5. Update src/templates/${INDUSTRY}/fallback.ts with client content"
echo ""
echo "WordPress setup:"
echo "  Webhook URL : \${NEXT_PUBLIC_SITE_URL}/api/revalidate"
echo "  ACF import  : docs/acf-fields-export.json"
echo "  Docs        : docs/SETUP.md"
echo ""
