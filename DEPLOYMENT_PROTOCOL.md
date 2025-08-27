# Ghost Theme Deployment Protocol
## Maali Theme - Complete Setup Documentation

---

## 📋 Overview
This document provides a complete protocol for deploying the Maali Ghost theme from GitHub to Ghost Pro using GitHub Actions.

---

## 🏗️ Repository Structure

### Current Setup (Correct)
```
/Users/marcus/implicator.ai/ (repository root)
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── .git/                      # Git repository (correctly located)
├── assets/
│   ├── css/                   # Stylesheets
│   ├── dist/                  # Compiled assets
│   │   ├── app.min.css
│   │   └── app.min.js
│   ├── js/                    # JavaScript files
│   └── landingpages.css
├── locales/                   # Translation files (8 languages)
├── partials/                  # Reusable template parts
│   ├── hero/                  # Hero section variants
│   ├── icons/                 # SVG icons
│   └── [various .hbs files]
├── node_modules/              # Dependencies (not tracked in git)
├── maali_old/                 # Backup of previous version
├── package.json               # Theme configuration
├── package-lock.json
├── gulpfile.js               # Build configuration
├── *.hbs                     # Template files
└── [various utility .js files]
```

---

## 🚀 Deployment Pipeline

### 1. Local Development
- **Working Directory**: `/Users/marcus/implicator.ai/`
- **Development Server**: `npm run dev` (runs on http://localhost:3368)
- **Build Process**: `npx gulp build` (compiles CSS/JS to `assets/dist/`)

### 2. Version Control
- **Repository**: https://github.com/marcus-cali/maali
- **Branch**: `main`
- **Remote**: `origin https://github.com/marcus-cali/maali.git`

### 3. Continuous Deployment
- **Trigger**: Push to `main` branch
- **Action**: GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Deployment**: Automatic to Ghost Pro via Ghost Admin API

---

## 🔧 Configuration Files

### package.json
```json
{
  "name": "maali",
  "description": "Professional premium theme",
  "version": "1.8.0",
  "private": true,
  "license": "MIT",
  "author": {
    "email": "hello@gbjsolution.com"
  },
  "keywords": ["ghost", "theme", "ghost-theme"],
  "config": {
    "posts_per_page": 9,
    "image_sizes": {
      "xxs": { "width": 30 },
      "xs": { "width": 100 },
      "s": { "width": 300 },
      "m": { "width": 600 },
      "l": { "width": 1200 },
      "xl": { "width": 2000 }
    }
  }
}
```

### GitHub Actions Workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy Theme to Ghost
on:
  push:
    branches:
      - main
      - master
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Ghost Theme
        uses: TryGhost/action-deploy-theme@v1
        with:
          api-url: ${{ secrets.GHOST_ADMIN_API_URL }}
          api-key: ${{ secrets.GHOST_ADMIN_API_KEY }}
```

---

## 🔐 API Configuration

### Required GitHub Secrets
1. **GHOST_ADMIN_API_URL**: Your Ghost site URL (e.g., `https://implicator.ghost.io`)
2. **GHOST_ADMIN_API_KEY**: Admin API Key from Ghost Integration

### Setting up Ghost Integration
1. Log into Ghost Admin (`yoursite.ghost.io/ghost`)
2. Navigate to: Settings → Integrations
3. Click "Add custom integration"
4. Name it: "GitHub Deploy"
5. Copy the generated:
   - Admin API URL
   - Admin API Key

### Adding Secrets to GitHub
1. Go to: https://github.com/marcus-cali/maali/settings
2. Navigate to: Secrets and variables → Actions
3. Add repository secrets:
   - `GHOST_ADMIN_API_URL`
   - `GHOST_ADMIN_API_KEY`

---

## 📝 Git Commands Reference

### Initial Setup (Completed)
```bash
# Initialize repository in correct directory
cd /Users/marcus/implicator.ai
git init

# Add remote repository
git remote add origin https://github.com/marcus-cali/maali.git

# Initial commit and push
git add .
git commit -m "Initial commit of Maali Ghost theme"
git push -u origin main
```

### Daily Workflow
```bash
# Check status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Your change description"

# Push to trigger deployment
git push
```

---

## ✅ Completed Tasks

### August 27, 2025
1. ✅ Cleaned up incorrect repository structure
2. ✅ Deleted and recreated GitHub repository
3. ✅ Initialized Git in correct directory (`/Users/marcus/implicator.ai/`)
4. ✅ Added all theme files with proper structure
5. ✅ Created GitHub Actions workflow
6. ✅ Pushed complete theme to GitHub

### Previous Changes
- Modified `partials/post-author-date.hbs`: Author name now left-aligned above date
- Modified `assets/css/components/_post.css`: Added stacked layout styles
- Built production CSS with `npx gulp build`

---

## 🔄 Deployment Process

### Automatic Deployment Flow
```
1. Developer pushes code to GitHub
   ↓
2. GitHub Actions triggered
   ↓
3. Action checks out code
   ↓
4. Creates theme zip file
   ↓
5. Uploads to Ghost Pro via API
   ↓
6. Theme activated on Ghost site
```

### Manual Deployment Trigger
1. Go to: https://github.com/marcus-cali/maali/actions
2. Select the latest workflow run
3. Click "Re-run jobs" if needed

---

## 🛠️ Troubleshooting

### Common Issues

#### Issue: GitHub Action fails with "No package.json found"
**Cause**: Files are in subdirectory instead of repository root
**Solution**: Ensure Git repository is initialized in theme directory, not parent

#### Issue: Authentication failed
**Cause**: Missing or incorrect API credentials
**Solution**: Verify GitHub secrets match Ghost integration credentials

#### Issue: Theme doesn't update after push
**Cause**: Workflow didn't trigger or failed
**Solution**: Check Actions tab in GitHub for error logs

### Verification Commands
```bash
# Verify repository structure
git ls-tree --name-only HEAD

# Check remote configuration
git remote -v

# View recent commits
git log --oneline -5

# Check workflow runs
# Visit: https://github.com/marcus-cali/maali/actions
```

---

## 📊 Status Indicators

### GitHub Actions Badge
You can add this to your README:
```markdown
[![Deploy Theme](https://github.com/marcus-cali/maali/actions/workflows/deploy.yml/badge.svg)](https://github.com/marcus-cali/maali/actions/workflows/deploy.yml)
```

### Current Status
- Repository: ✅ Active
- Workflow: ✅ Configured
- API Secrets: ⏳ Pending (need to be added by user)
- Last Deployment: N/A (awaiting secrets)

---

## 🔗 Important Links

- **GitHub Repository**: https://github.com/marcus-cali/maali
- **GitHub Actions**: https://github.com/marcus-cali/maali/actions
- **Ghost Admin**: https://[your-site].ghost.io/ghost
- **Local Development**: http://localhost:3368

---

## 📚 Additional Resources

- [Ghost Theme Documentation](https://ghost.org/docs/themes/)
- [Ghost Admin API](https://ghost.org/docs/admin-api/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [TryGhost/action-deploy-theme](https://github.com/TryGhost/action-deploy-theme)

---

## 📌 Next Steps

1. [ ] Add Ghost API credentials to GitHub Secrets
2. [ることVerify automatic deployment works
3. [ ] Test theme changes deployment
4. [ ] Set up branch protection rules (optional)
5. [ ] Configure additional environments (staging/production)

---

## 👤 Contact & Support

- **Theme**: Maali v1.8.0
- **Repository Owner**: marcus-cali
- **Ghost Site**: implicator.ai

---

*Last Updated: August 27, 2025*
*Document Version: 1.0*