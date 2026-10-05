# Moltify LinkedIn Post Agent Webhook

Cloudflare Worker webhook for Moltify.ai to generate LinkedIn posts automatically.

## Deployment

1. Install Wrangler CLI: `npm i -g wrangler`
2. Login: `wrangler login`
3. Set secret: `wrangler secret put OPENROUTER_API_KEY`
4. Deploy: `wrangler deploy`

## Usage

Moltify will POST to this webhook with:
```json
{
  "input": "Topic for post",
  "style": "professional, casual etc",
  "niche": "coaching, saas etc"
}
```

Returns:
```json
{
  "result": "Generated LinkedIn post...",
  "success": true
}
```
