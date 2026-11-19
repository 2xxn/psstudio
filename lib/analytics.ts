type AnalyticsProperties = Record<string, string | number | boolean>

type UmamiTracker = {
  track: (eventName: string, eventData?: AnalyticsProperties) => void
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

/**
 * Sends an anonymous usage event to Umami if the tracker is loaded.
 * No-ops on self-hosted instances without analytics or when the script is blocked.
 */
export function trackEvent(eventName: string, eventData?: AnalyticsProperties) {
  if (typeof window === "undefined") return
  window.umami?.track(eventName, eventData)
}
