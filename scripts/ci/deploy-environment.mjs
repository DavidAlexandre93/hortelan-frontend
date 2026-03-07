import fs from "node:fs";

const [environment] = process.argv.slice(2);

if (!environment) {
  console.error(
    "Usage: node scripts/ci/deploy-environment.mjs <development|staging|production>",
  );
  process.exit(1);
}

if (!fs.existsSync("build")) {
  console.error(
    "Build artifact not found at ./build. Run build before deploy.",
  );
  process.exit(1);
}

const webhookUrl = process.env.DEPLOY_WEBHOOK_URL;
const commitSha = process.env.GITHUB_SHA ?? "local";

if (!webhookUrl) {
  console.log(
    `[dry-run] Deploy for ${environment} skipped: DEPLOY_WEBHOOK_URL is not configured.`,
  );
  process.exit(0);
}

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.DEPLOY_WEBHOOK_TOKEN
      ? `Bearer ${process.env.DEPLOY_WEBHOOK_TOKEN}`
      : "",
  },
  body: JSON.stringify({
    environment,
    commitSha,
    source: "github-actions",
  }),
});

if (!response.ok) {
  const body = await response.text();
  console.error(`Deployment webhook failed (${response.status}): ${body}`);
  process.exit(1);
}

console.log(`Deployment for ${environment} requested successfully.`);
