"use client";

export const useClickAnalytics = () => {
  const trackClick = async (elementId: string, elementType = "card") => {
    try {
      // Use environment variable for API URL (works for both local and production)
      const apiUrl = process.env.NEXT_PUBLIC_SOLUTIONS_API_URL || "http://localhost:8002";

      await fetch(`${apiUrl}/click-analytics/api/track-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          element_id: elementId,
          element_type: elementType,
          page_url: typeof window !== "undefined" ? window.location.pathname : "unknown",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // don't block navigation on analytics errors
      // optionally log to console for debugging
      // console.error('Click analytics error', error);
    }
  };

  return { trackClick };
};
