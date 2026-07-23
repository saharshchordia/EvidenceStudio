# Physical Evidence to Underwriting

A clickable prototype showing how physical evidence from an asset tour becomes structured intelligence and refine underwriting assumptions. Demo version created as full workflow is proprietary.

The experience follows one evidence chain from capture to decision:

1. A field walkthrough records current conditions in an asset and its units. Commentary is part of the tour.
2. Analysis identifies spaces, materials, finishes, condition signals, and the source moments that support each observation.
3. Those observations populate an asset ontology that connects the property, common areas, residential inventory, and unit-level facts.
4. A reviewer can inspect the source evidence behind a finding and translate it into a documented underwriting change.

In the demonstrated unit, observed kitchen finishes reduce the renovation budget from **$18,500 to $15,250 per unit**. Appliance replacement is removed from scope because the existing stainless steel package is retained; cabinet repainting remains. The same evidence supports marking market rent from **$1,925 to $2,015 per month** against a slightly higher-quality comparable.

## Portfolio-scale operating model

This prototype represents a workflow that is scaled across a real estate portfolio, not a one-off video review. The operating system combines:

- **Devices:** consistent field-capture hardware and guided walkthroughs that create reviewable physical evidence.
- **Processes:** repeatable tour protocols, quality checks, exception handling, and human review for consequential findings.
- **Pipelines:** ingestion, frame extraction, space and feature classification, evidence linking, ontology creation, and underwriting export.
- **Governance:** every modeled change retains its source moment, confidence, rationale, and review state.

Together, these components turn unstructured field observations into a continuously improving record of asset quality. That record sharpens renovation scopes, rent assumptions, capital plans, and portfolio-level comparisons while keeping the physical evidence attached to each decision.

## Prototype flow

1. Review the trimmed source tour and inspect the computer-vision detections for the oven, refrigerator, countertops, and cabinets.
2. Run the simulated analysis to classify appliance quality, identify a cabinet color update, and flag the countertops for further diligence.
3. Explore the generated asset ontology and expand the 309-unit inventory into 31 observed and 278 not-observed units.
4. Select observed Unit 101 to inspect the linked kitchen evidence and the resulting renovation budget, market rent, and finish quality assumptions.

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
