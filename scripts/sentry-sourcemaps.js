#!/usr/bin/env node

const { execSync } = require('node:child_process');

const authToken = process.env.SENTRY_AUTH_TOKEN;

if (!authToken) {
  console.log('Skipping Sentry sourcemaps upload: SENTRY_AUTH_TOKEN is not set.');
  process.exit(0);
}

execSync(
  'sentry-cli sourcemaps inject --org hortelan --project hortelan-frontend ./ && sentry-cli sourcemaps upload --org hortelan --project hortelan-frontend ./',
  { stdio: 'inherit' }
);
