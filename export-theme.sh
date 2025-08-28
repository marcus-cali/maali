#!/bin/bash

# Maali Theme Export Script
# This script builds the theme and exports it to the output folder

echo "🚀 Starting Maali theme export..."

# Build CSS with gulp
echo "📦 Building CSS assets..."
npx gulp build

# Create timestamp for filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="output/maali_${TIMESTAMP}.zip"

# Create the theme zip file
echo "🗜️  Creating theme package..."
zip -r "$OUTPUT_FILE" . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x "output/*" \
  -x ".DS_Store" \
  -x "*.zip" \
  -x "export-theme.sh" \
  -x "docker-compose.yml" \
  -x ".vscode/*" \
  -x "maali_old/*"

# Create a 'latest' symlink for easy access
ln -sf "maali_${TIMESTAMP}.zip" "output/maali_latest.zip"

echo "✅ Theme exported successfully!"
echo "📍 Location: $OUTPUT_FILE"
echo "🔗 Latest version: output/maali_latest.zip"
echo ""
echo "You can now upload this file to your Ghost Pro admin panel:"
echo "Ghost Admin → Settings → Theme → Upload theme"