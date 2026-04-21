export type TestLane = "unit" | "e2e";

export interface ReviewCase {
  id: string;
  title: string;
  owner: string;
  lane: TestLane;
  generated: boolean;
  note: string;
}

export interface DraftReviewCase {
  title: string;
  owner: string;
  lane: TestLane;
}
