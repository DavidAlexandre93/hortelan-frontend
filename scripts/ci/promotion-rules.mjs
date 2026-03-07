const ENV_ORDER = ["development", "staging", "production"];

export function isValidEnvironment(environment) {
  return ENV_ORDER.includes(environment);
}

export function canPromote({
  from,
  to,
  ciStatus = "success",
  hasChangeApproval = false,
}) {
  if (!isValidEnvironment(from) || !isValidEnvironment(to)) {
    return {
      allowed: false,
      reason: "invalid_environment",
    };
  }

  if (ENV_ORDER.indexOf(to) <= ENV_ORDER.indexOf(from)) {
    return {
      allowed: false,
      reason: "non_forward_promotion",
    };
  }

  if (ciStatus !== "success") {
    return {
      allowed: false,
      reason: "ci_not_green",
    };
  }

  if (to === "production" && !hasChangeApproval) {
    return {
      allowed: false,
      reason: "missing_production_approval",
    };
  }

  return {
    allowed: true,
    reason: "ok",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [from, to, ciStatus = "success", hasChangeApproval = "false"] =
    process.argv.slice(2);
  const result = canPromote({
    from,
    to,
    ciStatus,
    hasChangeApproval: hasChangeApproval === "true",
  });

  if (!result.allowed) {
    console.error(`Promotion denied: ${result.reason}`);
    process.exit(1);
  }

  console.log(`Promotion allowed: ${from} -> ${to}`);
}
