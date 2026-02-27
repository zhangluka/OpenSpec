/**
 * Telemetry module for anonymous usage analytics.
 *
 * Privacy-first design:
 * - Only tracks command name and version
 * - No arguments, file paths, or content
 * - Off by default (opt-in): enable with telemetry.enabled=true or PHSPEC_TELEMETRY=1
 * - Disabled when DO_NOT_TRACK=1 or CI=true
 * - Anonymous ID is a random UUID with no relation to the user
 */
import { PostHog } from "posthog-node";
import { randomUUID } from "crypto";
import { getGlobalConfig } from "../core/global-config.js";
import { getTelemetryConfig, updateTelemetryConfig } from "./config.js";

// PostHog API key - public key for client-side analytics
// This is safe to embed as it only allows sending events, not reading data
const POSTHOG_API_KEY = "phc_Hthu8YvaIJ9QaFKyTG4TbVwkbd5ktcAFzVTKeMmoW2g";
// Using reverse proxy to avoid ad blockers and keep traffic on our domain
const POSTHOG_HOST = "https://edge.openspec.dev";

let posthogClient: PostHog | null = null;
let anonymousId: string | null = null;

/**
 * Check if telemetry is enabled.
 *
 * Off by default (opt-in). Enabled only when:
 * - telemetry.enabled=true in global config, or
 * - PHSPEC_TELEMETRY=1
 * and not overridden by DO_NOT_TRACK=1 or CI=true.
 */
export function isTelemetryEnabled(): boolean {
  // Always respect DO_NOT_TRACK and CI
  if (process.env.DO_NOT_TRACK === "1" || process.env.CI === "true") {
    return false;
  }

  // Explicit opt-out
  if (process.env.PHSPEC_TELEMETRY === "0") {
    return false;
  }

  // Opt-in: config or env must explicitly enable
  const globalConfig = getGlobalConfig();
  if (globalConfig.telemetry?.enabled === true) {
    return true;
  }
  if (process.env.PHSPEC_TELEMETRY === "1") {
    return true;
  }

  return false;
}

/**
 * Get or create the anonymous user ID.
 * Lazily generates a UUID on first call and persists it.
 */
export async function getOrCreateAnonymousId(): Promise<string> {
  // Return cached value if available
  if (anonymousId) {
    return anonymousId;
  }

  // Try to load from config
  const config = await getTelemetryConfig();
  if (config.anonymousId) {
    anonymousId = config.anonymousId;
    return anonymousId;
  }

  // Generate new UUID and persist
  anonymousId = randomUUID();
  await updateTelemetryConfig({ anonymousId });
  return anonymousId;
}

/**
 * Get the PostHog client instance.
 * Creates it on first call with CLI-optimized settings.
 */
function getClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1, // Send immediately, don't batch
      flushInterval: 0, // No timer-based flushing
    });
  }
  return posthogClient;
}

/**
 * Track a command execution.
 *
 * @param commandName - The command name (e.g., 'init', 'change:apply')
 * @param version - The OpenSpec version
 */
export async function trackCommand(
  commandName: string,
  version: string,
): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    const userId = await getOrCreateAnonymousId();
    const client = getClient();

    client.capture({
      distinctId: userId,
      event: "command_executed",
      properties: {
        command: commandName,
        version: version,
        surface: "cli",
        $ip: null, // Explicitly disable IP tracking
      },
    });
  } catch {
    // Silent failure - telemetry should never break CLI
  }
}

/**
 * Show first-run telemetry notice if not already seen.
 */
export async function maybeShowTelemetryNotice(): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    const config = await getTelemetryConfig();
    if (config.noticeSeen) {
      return;
    }

    // Display notice
    console.log(
      "Note: PhSpec collects anonymous usage stats. Disable: phspec config set telemetry.enabled false",
    );

    // Mark as seen
    await updateTelemetryConfig({ noticeSeen: true });
  } catch {
    // Silent failure - telemetry should never break CLI
  }
}

/**
 * Shutdown the PostHog client and flush pending events.
 * Call this before CLI exit.
 */
export async function shutdown(): Promise<void> {
  if (!posthogClient) {
    return;
  }

  try {
    await posthogClient.shutdown();
  } catch {
    // Silent failure - telemetry should never break CLI exit
  } finally {
    posthogClient = null;
  }
}
