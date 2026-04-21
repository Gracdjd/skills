import { buildCoverageSummary, createReviewCase, matchesSearch, seedReviewCases } from "../lib/coverageBoard";

describe("coverageBoard helpers", () => {
  it("creates a deterministic review case payload", () => {
    expect(createReviewCase("Checkout Retry", "Mina", "e2e", 5)).toEqual({
      id: "e2e-checkout-retry-5",
      title: "Checkout Retry",
      owner: "Mina",
      lane: "e2e",
      generated: false,
      note: "Review will land a browser journey before final harness."
    });

    expect(createReviewCase("Toast Copy", "Ari", "unit", 6).note).toContain("deterministic unit check");
  });

  it("matches search text across title owner lane and note", () => {
    const target = seedReviewCases[1];

    expect(matchesSearch(target, "")).toBe(true);
    expect(matchesSearch(target, "theo")).toBe(true);
    expect(matchesSearch(target, "browser spec")).toBe(true);
    expect(matchesSearch(target, "unit")).toBe(false);
  });

  it("builds generated coverage totals by lane", () => {
    expect(buildCoverageSummary(seedReviewCases)).toEqual({
      total: 4,
      generated: 2,
      percent: 50,
      byLane: {
        unit: {
          total: 2,
          generated: 1
        },
        e2e: {
          total: 2,
          generated: 1
        }
      }
    });

    expect(buildCoverageSummary([]).percent).toBe(0);
  });
});
