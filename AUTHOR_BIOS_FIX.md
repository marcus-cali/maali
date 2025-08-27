# Author Bios Fix Documentation

## Issue
Author bios were not displaying on individual blog posts at implicator.ai, even though they were visible on author pages.

## Root Cause
The author section was being hidden by a CSS rule in `partials/theme-settings.hbs`:
```css
.post-info__avatars, .post-info__authors+time:before, .post-authors {
  display: none!important;
}
```

## Solution
1. Modified `partials/theme-settings.hbs` to remove `.post-authors` from the CSS hide rule:
```css
.post-info__avatars, .post-info__authors+time:before {
  display: none!important;
}
```

2. The theme already had the necessary code in `partials/post-authors.hbs` to fetch and display author bios using Ghost's `{{#get}}` helper.

## Files Modified
- `partials/theme-settings.hbs` - Removed `.post-authors` from CSS hide rule (line 78)
- `partials/post-authors.hbs` - Already had correct implementation, no changes needed

## Deployment
Changes are automatically deployed via GitHub Actions when pushed to the main branch.

## Date Fixed
January 12, 2025