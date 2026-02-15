An app for learning lots of the worlds alphabets, or inventing your own.

## Current status

This repository currently contains a **stub implementation** of the app.
It intentionally includes many `TODO` markers across the UI to outline planned
features:

- alphabet library loading and search
- glyph metadata and pronunciation playback
- custom alphabet composer and draft persistence
- practice mode and adaptive progress tracking
- API contracts, testing, and observability

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production bundle is generated in `dist/`.

## CI and GitHub Pages

GitHub Actions is configured to:

1. build the app on every push and pull request
2. deploy to GitHub Pages from pushes to `main` or `master`

The Pages deployment uses the built `dist/` directory as its artifact.
