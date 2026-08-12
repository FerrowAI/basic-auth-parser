const {
  parseBasic,
  parseBearer,
  parseDigest,
  timingSafeCompare,
  buildWWWAuthenticate,
} = require("../dist/index");

// Demo: Basic auth with colon in password
const basicAuth = "Basic " + Buffer.from("user:pass:word").toString("base64");
const parsed = parseBasic(basicAuth);
console.log("Basic auth (colon in password):");
console.log("  Username:", parsed.username);
console.log("  Password:", parsed.password);
console.log("  Password contains colon:", parsed.password.includes(":"));

// Demo: Bearer token
const bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const token = parseBearer(bearer);
console.log("\nBearer token:", token);

// Demo: Digest parsing
const digest =
  'Digest realm="test@example.com", username="user", nonce="abc123", uri="/api", response="xyz"';
const parsed_digest = parseDigest(digest);
console.log("\nDigest fields:", parsed_digest);

// Demo: Timing-safe comparison
const pwd1 = "correctPassword";
const pwd2 = "correctPassword";
const pwd3 = "wrongPassword";
console.log("\nTiming-safe comparison:");
console.log("  pwd1 == pwd2:", timingSafeCompare(pwd1, pwd2));
console.log("  pwd1 == pwd3:", timingSafeCompare(pwd1, pwd3));

// Demo: WWW-Authenticate builder
console.log("\nWWW-Authenticate headers:");
console.log("  Basic:", buildWWWAuthenticate("Basic", { realm: "Restricted" }));
console.log("  Bearer:", buildWWWAuthenticate("Bearer"));
console.log(
  "  Digest:",
  buildWWWAuthenticate("Digest", { realm: "api@example.com" })
);
