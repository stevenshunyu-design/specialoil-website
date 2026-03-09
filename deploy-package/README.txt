# CN-SpecLube Chain Website Deployment

## Quick Deploy Steps

1. Upload all files to your server
2. Create .env file from .env.example
3. Run: npm install --production
4. Run: pm2 start server.production.js --name specialoil
5. Run: pm2 save

## Required Environment Variables

- SUPABASE_URL
- SUPABASE_ANON_KEY
- RESEND_API_KEY
- FROM_EMAIL
- SITE_URL

## Troubleshooting

If you see 503 error:
1. Check if Node.js process is running: pm2 list
2. Check logs: pm2 logs specialoil
3. Test manually: node server.production.js
