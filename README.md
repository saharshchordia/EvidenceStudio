# Asset Intelligence Prototype

A brand-agnostic, clickable prototype that turns a property walkthrough into a structured asset ontology, unit-level evidence, and revised underwriting assumptions.

## Experience

1. Review the source property tour and run the simulated analysis.
2. Explore the generated asset ontology.
3. Open unit insights, jump between evidence moments, and review changes to renovation budget, rent, and finish quality.

## Local development

```bash
npm install
npm run dev
```

The GitHub Pages build is generated with:

```bash
npm run build
```

Deployment is handled by `.github/workflows/deploy-pages.yml` on pushes to `main`. In the repository settings, set Pages source to **GitHub Actions**.
