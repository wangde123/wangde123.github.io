# DAY-Mobile

A mobile-oriented React + Umi + Ant Design Mobile project.

## Local Development

```bash
pnpm install
pnpm dev
```

## Environment Variables

Create a `.env` file (see `.env.example`) with:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_public_anon_key
PUBLIC_PATH=/DAY-Mobile/
```

For GitHub Pages deployments keep `PUBLIC_PATH` as `/DAY-Mobile/`. On Vercel set `PUBLIC_PATH=/` in the project settings.

## Supabase Image Uploads

1. In Supabase Dashboard create a **public** bucket named `photos` (already done).
2. Fill `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` (and the Vercel/GitHub environment variable settings) so the client can initialize the SDK.
3. Start the dev server (`pnpm dev`) and use the ImageUploader on the home page. Each upload is stored under `photos/uploads/<timestamp>-<random>.ext` and the public URL is shown immediately.
4. Redeploy to GitHub Pages or Vercel after configuring the same environment variables in their settings.

## Deployment

- **GitHub Pages**: existing workflow uses `PUBLIC_PATH=/DAY-Mobile/`.
- **Vercel**: connect repo, set `PUBLIC_PATH=/`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` in Project Settings → Environment Variables, then redeploy.
