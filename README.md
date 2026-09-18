# CastIQ 🎣

CastIQ is a mobile-first fishing recommendation app prototype.

## Current MVP

- Waterbody, species, date and time inputs
- Water temperature, wind, sky and clarity inputs
- Real recommendation scoring engine
- Top 3 lure/bait recommendations
- Presentation, habitat and condition-fit guidance
- Adaptive "not getting bites" mode
- GitHub Pages-ready static build

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## GitHub Pages

This is a Vite project. For a production deployment, use GitHub Actions to run `npm ci` and `npm run build`, then publish `dist/` to GitHub Pages.

## Next development targets

1. Real weather API
2. Lake/reservoir search and map data
3. Water temperature and water-level sources
4. Fish species database by waterbody
5. AI tackle-box image recognition
6. User accounts and fishing logs
7. Affiliate product catalog
8. Personalized recommendation learning from catch reports
