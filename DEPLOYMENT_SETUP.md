# Ghost Theme Deployment Setup

## GitHub Secrets Configuration

To enable automatic deployment to your Ghost site, you need to configure the following GitHub secrets:

### 1. Get Your Ghost Admin API Key

1. Log into your Ghost Admin panel: `https://yourdomain.com/ghost`
2. Go to **Settings** → **Integrations**
3. Click **+ Add custom integration**
4. Name it "GitHub Deployment" (or similar)
5. Copy the **Admin API Key** (it will look like: `5f3....:7b3....`)
6. Copy your **API URL** (usually `https://yourdomain.com`)

### 2. Add Secrets to GitHub

1. Go to your repository: https://github.com/marcus-cali/maali
2. Click **Settings** (in the repository, not your profile)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add these two secrets:

#### Secret 1: GHOST_ADMIN_URL
- **Name:** `GHOST_ADMIN_URL`
- **Value:** Your Ghost site URL (e.g., `https://yourdomain.com`)

#### Secret 2: GHOST_ADMIN_KEY
- **Name:** `GHOST_ADMIN_KEY`
- **Value:** The Admin API Key you copied from Ghost

### 3. Test Deployment

Once the secrets are configured:
1. The workflow will run automatically on every push to `main`
2. Or you can manually trigger it:
   - Go to **Actions** tab in your GitHub repository
   - Click on "Deploy Theme to Ghost"
   - Click **Run workflow** → **Run workflow**

### Alternative: Manual Deployment

If you prefer not to use the API, you can modify the workflow to create a release with the theme zip file that you can manually upload.

## Security Notes

- Never commit API keys directly to the repository
- The Admin API key allows full control of your Ghost site
- Keep your API keys secure and rotate them periodically
- You can revoke/regenerate keys anytime in Ghost Admin → Integrations