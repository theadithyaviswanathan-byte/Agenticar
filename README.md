# Agenticar Services

Interactive Next.js app for:
- price estimate workflow
- appointment scheduling workflow
- mechanic queue + assistant chat workflow

## Local Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Deploy Free on GitHub Pages

This repo is already configured to auto-deploy from `main` using GitHub Actions in:
- `.github/workflows/deploy-pages.yml`

### One-time setup

1. Create an empty GitHub repo.
2. Add it as remote:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   ```
3. Push:
   ```bash
   git push -u origin main
   ```
4. In GitHub: `Settings` -> `Pages` -> `Source` = `GitHub Actions`.

After each push to `main`, Pages redeploys automatically.

### Final URL

- If repo is `<your-username>.github.io`: `https://<your-username>.github.io/`
- Otherwise: `https://<your-username>.github.io/<your-repo>/`
