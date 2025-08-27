#!/bin/bash

# Ghost Theme Deployment Script
# This script creates a clean theme package and can upload it to Ghost

echo "🚀 Starting Ghost Theme Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create a temporary directory for the clean theme
TEMP_DIR=$(mktemp -d)
THEME_NAME="maali"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIP_FILE="${THEME_NAME}_${TIMESTAMP}.zip"

echo "📦 Creating clean theme package..."

# Copy theme files, excluding development files
rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='*.js' \
  --exclude='*.md' \
  --exclude='.DS_Store' \
  --exclude='dist' \
  --exclude='maali_old' \
  --exclude='.github' \
  --exclude='deploy.sh' \
  --exclude='*.zip' \
  . "$TEMP_DIR/"

# Create zip file
cd "$TEMP_DIR"
zip -r "$ZIP_FILE" . -q

# Move zip back to original directory
mv "$ZIP_FILE" "$OLDPWD/"
cd "$OLDPWD"

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✅ Theme package created: $ZIP_FILE${NC}"
echo ""
echo "📋 Next steps to deploy to your Ghost site:"
echo "   1. Log into your Ghost Admin panel"
echo "   2. Go to Settings → Design"
echo "   3. Click 'Change theme' → 'Upload theme'"
echo "   4. Upload the file: $(pwd)/$ZIP_FILE"
echo "   5. Click 'Activate'"
echo ""
echo -e "${YELLOW}💡 Tip: The theme package is ready at:${NC}"
echo "   $(pwd)/$ZIP_FILE"