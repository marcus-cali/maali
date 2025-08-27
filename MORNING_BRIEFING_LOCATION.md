# Morning Briefing Section - Important Information

## Location
The "Morning Briefing" section is **NOT in the sidebar** as one might expect. It's actually located in the homepage hero section.

### Correct File Location
- **Template File**: `/partials/hero/3-featured+latest.hbs`
- **Lines**: 26-40 (approximately)
- **Section**: Part of the hero layout on the homepage

### Text/Translation
- **Translation Key**: `{{t "Morning briefing"}}`
- **English Text File**: `/locales/en.json` (line 13)
- **Translation Key**: `"Morning briefing": "Morning Briefing"`

## How It Works
1. The Morning Briefing appears on the homepage when the theme setting `@custom.hero_layout` is set to "3 featured posts & latest news"
2. It displays posts tagged with `nl` (newsletter tag)
3. The section uses the `post-card-simple` partial to display each post

## Files Involved
1. **Main Template**: `/partials/hero/3-featured+latest.hbs`
2. **Homepage Controller**: `/home.hbs` (determines which hero layout to use)
3. **Translation Files**: `/locales/en.json` (and other language files)
4. **Post Card Template**: `/partials/post-card-simple.hbs`
5. **Author Display**: `/partials/post-author-date.hbs`

## How to Hide Author Names
To hide author names in the Morning Briefing section:

1. **Add CSS styles** in the template file (`3-featured+latest.hbs`):
```css
.morning-briefing-section .post-info__authors,
.morning-briefing-section .post-info__avatars,
.morning-briefing-section .post-info > span:first-of-type,
.morning-briefing-section .post-info > a[href*="/author/"] {
  display: none !important;
}
```

2. **Add the hide_author parameter** when calling post-card-simple:
```handlebars
{{> post-card-simple hide_author=true}}
```

## Common Misconceptions
- ❌ The Morning Briefing is NOT in `/partials/sidebar.hbs`
- ❌ It's NOT a standalone sidebar widget
- ✅ It's part of the homepage hero section
- ✅ It only appears with specific hero layout settings

## Theme Settings
The Morning Briefing only appears when the Ghost theme setting for hero layout includes it. Check the Ghost Admin panel under:
- Settings → Design → Theme settings → Hero layout
- Should be set to: "3 featured posts & latest news"

## Related Files That DON'T Contain Morning Briefing
- `/partials/sidebar.hbs` - This is for actual sidebar widgets
- `/partials/hero/3-featured+latest+editors.hbs` - Shows "Latest news" and "Editor's picks" instead
- `/partials/hero/3-featured+latest-v2.hbs` - Shows only "Latest news"

## Deployment
After making changes:
1. Update version number in `package.json`
2. Commit and push to GitHub
3. GitHub Actions will automatically deploy to Ghost (via `.github/workflows/deploy.yml`)
4. Changes should appear within 30-60 seconds on the live site

## Last Updated
- Date: August 26, 2025
- Version: 1.8.5
- Change: Successfully located and updated Morning Briefing to hide author names