import test from "node:test";
import assert from "node:assert/strict";

import {
  canPromote,
  isValidEnvironment,
} from "../scripts/ci/promotion-rules.mjs";

test("isValidEnvironment validates only known environments", () => {
  assert.equal(isValidEnvironment("development"), true);
  assert.equal(isValidEnvironment("staging"), true);
  assert.equal(isValidEnvironment("production"), true);
  assert.equal(isValidEnvironment("qa"), false);
});

test("canPromote allows development to staging when CI is green", () => {
  const result = canPromote({
    from: "development",
    to: "staging",
    ciStatus: "success",
  });

  assert.deepEqual(result, {
    allowed: true,
    reason: "ok",
  });
});

test("canPromote blocks production promotion without explicit approval", () => {
  const result = canPromote({
    from: "staging",
    to: "production",
    ciStatus: "success",
    hasChangeApproval: false,
  });

  assert.deepEqual(result, {
    allowed: false,
    reason: "missing_production_approval",
  });
});

test("canPromote blocks non-forward promotion path", () => {
  const result = canPromote({
    from: "staging",
    to: "development",
    ciStatus: "success",
  });

  assert.deepEqual(result, {
    allowed: false,
    reason: "non_forward_promotion",
  });
});
