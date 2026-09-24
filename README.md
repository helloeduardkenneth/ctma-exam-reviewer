# CTMA Practice Reviewer

A mobile-first, client-side flashcard reviewer with 60 original practice questions aligned to the public CTMA exam blueprint.

## Local development

The project requires Node.js 22.12 or newer. This workspace was verified with Node.js 22.23.2.

```powershell
nvm use 22.23.2
npm install
npm run dev
```

If an older Node installation appears first on PATH after `nvm use`, open a new terminal or place the active NVM symlink before older Node paths.

## Verification

```powershell
npm run lint
npm test
npm run build
```

## Deployment

Import the repository into Vercel and select the Vite framework preset. Vercel will use `npm run build` and publish the `dist` directory. No environment variables or backend services are required.

## Content notice

This is an independent study tool. It is not affiliated with or endorsed by ACAMS or Pearson VUE. All practice questions are original and do not reproduce certification exam content.
