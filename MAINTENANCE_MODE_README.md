# Maintenance Mode for Zeno App

This Next.js application includes a maintenance mode feature that allows you to temporarily disable access to the site while performing updates or maintenance.

## How It Works

The maintenance mode is implemented using Next.js middleware (`middleware.ts`) that:

1. **Checks an environment variable** (`MAINTENANCE_MODE`) to determine if maintenance mode is active
2. **Redirects all traffic** to the `/maintenance` page when enabled
3. **Allows access** to essential static assets and the maintenance page itself
4. **Preserves API routes** for any backend operations that might need to continue

## Quick Start

### Enable Maintenance Mode

```bash
# Using npm script (recommended)
npm run maintenance:enable

# Or manually
echo "MAINTENANCE_MODE=true" >> .env.local
```

### Disable Maintenance Mode

```bash
# Using npm script (recommended)
npm run maintenance:disable

# Or manually
echo "MAINTENANCE_MODE=false" >> .env.local
```

### Check Current Status

```bash
npm run maintenance:status
```

### Toggle Maintenance Mode

```bash
npm run maintenance:toggle
```

## Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Enable maintenance mode
MAINTENANCE_MODE=true

# Disable maintenance mode
MAINTENANCE_MODE=false
```

## Important Notes

1. **Server Restart Required**: After changing the `MAINTENANCE_MODE` environment variable, you must restart your Next.js server for the changes to take effect.

2. **Static Assets**: The middleware allows access to:
   - `/maintenance` page
   - `/_next/*` (Next.js internal files)
   - `/favicon*` files
   - `/icons/*` files
   - `/manifest*` files
   - `/sw-custom*` files
   - `/zeno-logo*` files

3. **API Routes**: API routes (`/api/*`) are excluded from the middleware matcher, so they continue to function normally.

4. **Maintenance Page**: The existing `/maintenance` page will be displayed to users when maintenance mode is active.

## File Structure

```
zeno-app/
├── middleware.ts                    # Next.js middleware for maintenance mode
├── scripts/
│   └── toggle-maintenance.js       # Helper script to manage maintenance mode
├── src/app/maintenance/
│   └── page.tsx                    # Maintenance page UI
├── package.json                     # NPM scripts for maintenance mode
└── .env.local                      # Environment variables (create this file)
```

## Troubleshooting

### Maintenance Mode Not Working?

1. **Check environment variable**: Ensure `MAINTENANCE_MODE=true` is in your `.env.local` file
2. **Restart server**: Next.js middleware only loads on server restart
3. **Check file location**: Ensure `.env.local` is in the project root (same level as `package.json`)
4. **Verify middleware**: Check that `middleware.ts` exists in the project root

### Want to Customize the Response?

You can modify the `middleware.ts` file to:
- Return a custom 503 response instead of redirecting
- Add custom headers
- Implement different logic for different user types
- Add IP whitelisting for admin access

Example custom response:
```typescript
if (isMaintenanceMode) {
  return new NextResponse("Site temporarily unavailable", { 
    status: 503,
    headers: {
      'Retry-After': '3600', // Retry after 1 hour
      'Content-Type': 'text/plain'
    }
  });
}
```

## Security Considerations

- The maintenance mode is controlled by environment variables, not user input
- API routes remain accessible to prevent backend service disruption
- Static assets are still served to maintain the maintenance page functionality
- Consider IP whitelisting if you need admin access during maintenance
