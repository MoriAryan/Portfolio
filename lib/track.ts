/**
 * Tracking module for Project Vault & Portfolio Analytics.
 * In Phase 1: Queues events in memory and deduplicates per-project votes.
 * In Phase 2: Will POST validated payloads to the /api/track endpoint.
 *
 * Adheres strictly to privacy rules: no cookies, no localStorage identifiers,
 * no fingerprinting, no third-party trackers, no IP storage.
 */

export interface TrackEvent {
  type: string;
  projectSlug?: string;
  meta?: Record<string, string | number>;
}

// In-memory event queue
const eventQueue: TrackEvent[] = [];

// In-memory session vote store for deduplication
const sessionVotes = new Map<string, TrackEvent>();

/**
 * Tracks an event in memory.
 * Per spec: The vote count per project per session must be deduplicated:
 * a later vote on the same project by the same session replaces the previous one,
 * and Undo cancels it.
 */
export function track(event: TrackEvent): void {
  if (event.type === "vote" && event.projectSlug) {
    // Deduplicate: replace previous vote for this project
    const prevIndex = eventQueue.findIndex(
      (e) => e.type === "vote" && e.projectSlug === event.projectSlug
    );
    if (prevIndex !== -1) {
      eventQueue.splice(prevIndex, 1);
    }
    sessionVotes.set(event.projectSlug, event);
    eventQueue.push(event);
    return;
  }

  if (event.type === "vote_undo" && event.projectSlug) {
    // Undo cancels the previous vote on this project
    const prevIndex = eventQueue.findIndex(
      (e) => e.type === "vote" && e.projectSlug === event.projectSlug
    );
    if (prevIndex !== -1) {
      eventQueue.splice(prevIndex, 1);
    }
    sessionVotes.delete(event.projectSlug);
    eventQueue.push(event);
    return;
  }

  // Non-vote events (vault_view, project_open, deck_complete, deck_restart)
  eventQueue.push(event);
}

/**
 * Helper to inspect queued events during debugging / testing.
 */
export function getEventQueue(): readonly TrackEvent[] {
  return [...eventQueue];
}

/**
 * Helper to reset in-memory queue.
 */
export function clearEventQueue(): void {
  eventQueue.length = 0;
  sessionVotes.clear();
}
