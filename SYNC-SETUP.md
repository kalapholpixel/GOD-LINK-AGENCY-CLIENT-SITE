# PROPERTY-SALES-ADMIN Setup Notes

## Sync Configuration

This main website now loads content from a **shared admin dashboard**.

### How Sync Works

1. **Admin Site** (`/workspaces/PROPERTY-SALES-ADMIN/`):
   - Stores all content in `data/data.json`
   - Provides a web interface to edit everything
   - Auto-saves changes to the JSON file

2. **Main Website** (`/workspaces/PROPERTY-SALES/`):
   - Loads data via `data-loader.js`
   - Falls back to `content-template.js` if admin data unavailable
   - All pages refresh with new content automatically

### File Locations

- **Shared Data**: `/workspaces/PROPERTY-SALES-ADMIN/data/data.json`
- **Data Loader**: `/workspaces/PROPERTY-SALES/data-loader.js`
- **Fallback Data**: `/workspaces/PROPERTY-SALES/content-template.js`

### Updated Files

- `data-loader.js` - New loader script
- `index.html` - Added data-loader.js script
- `listings.html` - Added data-loader.js script
- `property.html` - Added data-loader.js script
- `contact.html` - Added data-loader.js script

### Running Both Sites

**Terminal 1 - Main Website (Port 3001):**
```bash
cd /workspaces/PROPERTY-SALES
python3 -m http.server 3001
```

**Terminal 2 - Admin Dashboard (Port 3002):**
```bash
cd /workspaces/PROPERTY-SALES-ADMIN
python3 -m http.server 3002
```

Visit:
- Main site: http://localhost:3001
- Admin site: http://localhost:3002

## Next Steps

1. ✅ Admin dashboard created
2. ✅ Data sync configured
3. ✅ Main site updated to load from admin data
4. TODO: Initialize both as separate Git repositories
   - Main site: `GOD-LINK-AGENCY-CLIENT-SITE`
   - Admin site: `GOD-LINK-AGENCY-ADMIN`
5. TODO: Deploy to hosting platform
