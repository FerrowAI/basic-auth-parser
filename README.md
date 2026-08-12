# basic-auth-parser

HTTP auth header parsing (Basic, Bearer, Digest) with timing-safe credential comparison.

## Quick Start

```typescript
import { parseBasic, timingSafeCompare } from "basic-auth-parser";

const auth = parseBasic("Basic dXNlcjpwYXNz");
if (timingSafeCompare(auth.password, stored)) {
  console.log("Authenticated");
}
```

## API

### `parseBasic(header: string): ParsedBasic | null`

Parse Basic auth (RFC 7617). Splits on first colon only (password can contain colons).

### `parseBearer(header: string): string | null`

Extract Bearer token.

### `parseDigest(header: string): Record<string, string> | null`

Parse Digest challenge fields (quoted-string aware).

### `timingSafeCompare(a: string, b: string): boolean`

Constant-time string comparison to prevent timing attacks.

### `buildWWWAuthenticate(scheme, options?): string`

Build WWW-Authenticate challenge header.

## Limits

- Digest parsing extracts fields; no response verification included
- No SCRAM or other advanced schemes

---

Part of the [ferrow-toolkit](https://github.com/FerrowAI/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)
