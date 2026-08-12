import { timingSafeEqual } from "crypto";

export interface ParsedBasic {
  username: string;
  password: string;
}

export interface AuthChallenge {
  scheme: string;
  realm?: string;
  charset?: string;
}

export function parseBasic(header: string): ParsedBasic | null {
  if (!header.startsWith("Basic ")) return null;

  const encoded = header.substring(6);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");

  // Split on FIRST colon only (password can contain colons)
  const colonIndex = decoded.indexOf(":");
  if (colonIndex === -1) return null;

  return {
    username: decoded.substring(0, colonIndex),
    password: decoded.substring(colonIndex + 1),
  };
}

export function parseBearer(header: string): string | null {
  if (!header.startsWith("Bearer ")) return null;
  return header.substring(7);
}

export function parseDigest(header: string): Record<string, string> | null {
  if (!header.startsWith("Digest ")) return null;

  const fields: Record<string, string> = {};
  const directives = header.substring(7);

  // Parse key="value" pairs, handling quoted strings
  const regex = /(\w+)=(?:"([^"]*)"|([^\s,]*))/g;
  let match;

  while ((match = regex.exec(directives)) !== null) {
    const key = match[1];
    const value = match[2] || match[3];
    fields[key] = value;
  }

  return Object.keys(fields).length > 0 ? fields : null;
}

export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");

  if (bufA.length !== bufB.length) {
    return false;
  }

  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function buildWWWAuthenticate(
  scheme: "Basic" | "Bearer" | "Digest",
  options?: { realm?: string; charset?: string }
): string {
  let header = scheme;

  if (scheme === "Basic") {
    if (options?.realm) {
      header += ` realm="${options.realm}"`;
    }
    if (options?.charset) {
      header += `, charset="${options.charset}"`;
    }
  } else if (scheme === "Digest") {
    if (options?.realm) {
      header += ` realm="${options.realm}"`;
    }
  }

  return header;
}

export default {
  parseBasic,
  parseBearer,
  parseDigest,
  timingSafeCompare,
  buildWWWAuthenticate,
};
