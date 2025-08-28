# Local Development Setup for Maali Theme

## 🎯 Quick Start

### Option 1: Manual Theme Export (No Local Ghost Needed)

#### Export Theme for Upload
```bash
# Build and export theme to output folder
./export-theme.sh
```

This creates a timestamped zip file in the `output/` folder:
- `output/maali_YYYYMMDD_HHMMSS.zip` - Timestamped version
- `output/maali_latest.zip` - Symlink to latest export

**Upload to Ghost Pro:**
1. Go to your Ghost Admin (yoursite.ghost.io/ghost)
2. Navigate to Settings → Theme
3. Click "Upload theme"
4. Select the zip file from the output folder
5. Activate the theme

---

## 🖥️ Local Ghost Installation (Optional)

### Prerequisites
To run Ghost locally, you need either:
- **Docker Desktop** (Recommended) - [Download here](https://www.docker.com/products/docker-desktop/)
- **Node.js 18.x** - For Ghost CLI installation

### Option 2A: Docker Setup (Recommended)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/

2. **Start Ghost with Docker:**
```bash
# Start local Ghost server
./ghost-local.sh start

# View logs
./ghost-local.sh logs

# Stop server
./ghost-local.sh stop
```

3. **Access Ghost:**
- Frontend: http://localhost:2368
- Admin: http://localhost:2368/ghost

### Option 2B: Ghost CLI Setup (Alternative)

1. **Install Ghost CLI globally:**
```bash
npm install -g ghost-cli@latest
```

2. **Create a local Ghost installation:**
```bash
# Create a separate directory for Ghost
mkdir ../ghost-local
cd ../ghost-local

# Install Ghost
ghost install local

# Create symlink to your theme
ln -s ../implicator.ai content/themes/maali
```

3. **Start Ghost:**
```bash
ghost start
```

4. **Access Ghost:**
- Frontend: http://localhost:2368
- Admin: http://localhost:2368/ghost

---

## 📂 Folder Structure

```
/Users/marcus/implicator.ai/
├── output/                    # Exported theme zips (git-ignored)
│   ├── maali_20250827_164532.zip
│   └── maali_latest.zip      # Symlink to latest
├── export-theme.sh           # Build and export script
├── ghost-local.sh           # Docker management script
├── docker-compose.yml       # Docker configuration
└── [theme files...]
```

---

## 🔄 Development Workflow

### Making Theme Changes

1. **Start development mode:**
```bash
# Watch for CSS/JS changes
npm run dev
```

2. **Make your changes** to theme files

3. **Export theme for testing:**
```bash
./export-theme.sh
```

4. **Upload to Ghost Pro:**
- Go to Ghost Admin → Settings → Theme
- Upload the zip from `output/` folder

### Quick Commands

```bash
# Build CSS/JS only
npx gulp build

# Export theme to output folder
./export-theme.sh

# Watch for changes (development)
npm run dev
```

---

## 🚀 Automated Exports

After any changes to the theme, run:
```bash
./export-theme.sh
```

This will:
1. Build production CSS/JS
2. Create a timestamped zip file
3. Save it to the `output/` folder
4. Create/update a `maali_latest.zip` symlink

---

## 📝 Important Notes

- The `output/` folder is git-ignored (not tracked)
- Each export creates a timestamped backup
- `maali_latest.zip` always points to the most recent export
- Theme changes require Ghost restart or re-upload to see updates

---

## 🔧 Troubleshooting

### Issue: Docker not installed
**Solution:** Install Docker Desktop or use Ghost CLI method

### Issue: Port 2368 already in use
**Solution:** Stop any other Ghost instances or change port in docker-compose.yml

### Issue: Theme not showing in Ghost
**Solution:** Restart Ghost or re-upload the theme zip

---

## 📋 Summary

For your workflow without Docker:
1. Make changes to theme files
2. Run `./export-theme.sh`
3. Upload `output/maali_latest.zip` to Ghost Pro

This gives you a simple workflow without needing local Ghost installation!