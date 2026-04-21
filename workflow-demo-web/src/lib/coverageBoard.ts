import type { ReviewCase, TestLane } from "../types";

export const seedReviewCases: ReviewCase[] = [
  {
    id: "unit-signup-null-guard-1",
    title: "Signup reducer null guard",
    owner: "Mina",
    lane: "unit",
    generated: true,
    note: "Covers the branch that rejects empty payloads before UI wiring."
  },
  {
    id: "e2e-pricing-happy-path-2",
    title: "Pricing flow happy path",
    owner: "Theo",
    lane: "e2e",
    generated: false,
    note: "The journey is designed in plan, but review has not materialized the browser spec yet."
  },
  {
    id: "unit-toast-copy-3",
    title: "Error toast copy contract",
    owner: "Ari",
    lane: "unit",
    generated: false,
    note: "Needs a deterministic assertion for the fallback message and severity mapping."
  },
  {
    id: "e2e-profile-retry-4",
    title: "Profile retry journey",
    owner: "June",
    lane: "e2e",
    generated: true,
    note: "Protects the retry CTA after a transient API failure."
  }
];

export function createReviewCase(title: string, owner: string, lane: TestLane, index: number): ReviewCase {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: `${lane}-${slug || "review-case"}-${index}`,
    title,
    owner,
    lane,
    generated: false,
    note: lane === "unit" ? "Review will land a deterministic unit check before final harness." : "Review will land a browser journey before final harness."
  };
}

export function matchesSearch(item: ReviewCase, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [item.title, item.owner, item.lane, item.note].join(" ").toLowerCase().includes(normalizedQuery);
}

function buildLaneSummary(items: ReviewCase[], lane: TestLane) {
  const filtered = items.filter((item) => item.lane === lane);
  const generated = filtered.filter((item) => item.generated).length;

  return {
    total: filtered.length,
    generated
  };
}

export function buildCoverageSummary(items: ReviewCase[]) {
  const total = items.length;
  const generated = items.filter((item) => item.generated).length;

  return {
    total,
    generated,
    percent: total === 0 ? 0 : Math.round((generated / total) * 100),
    byLane: {
      unit: buildLaneSummary(items, "unit"),
      e2e: buildLaneSummary(items, "e2e")
    }
  };
}
