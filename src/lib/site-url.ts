// Vercel define VERCEL_PROJECT_PRODUCTION_URL en cada despliegue.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = productionHost
  ? `https://${productionHost}`
  : "http://localhost:3000";
