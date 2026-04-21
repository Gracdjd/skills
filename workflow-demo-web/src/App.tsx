import { startTransition, useDeferredValue, useId, useState, type FormEvent } from "react";
import "./App.css";
import { buildCoverageSummary, createReviewCase, matchesSearch, seedReviewCases } from "./lib/coverageBoard";
import type { DraftReviewCase, ReviewCase, TestLane } from "./types";

const laneOptions: Array<{ value: TestLane; label: string }> = [
  { value: "unit", label: "Unit lane" },
  { value: "e2e", label: "E2E lane" }
];

const emptyDraft: DraftReviewCase = {
  title: "",
  owner: "",
  lane: "unit"
};

function App() {
  const titleId = useId();
  const ownerId = useId();
  const laneId = useId();
  const searchId = useId();

  const [reviewCases, setReviewCases] = useState<ReviewCase[]>(seedReviewCases);
  const [draft, setDraft] = useState<DraftReviewCase>(emptyDraft);
  const [feedback, setFeedback] = useState("Plan owns the matrix. Review owns the executable tests.");
  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);
  const visibleCases = reviewCases.filter((item) => matchesSearch(item, deferredSearch));
  const summary = buildCoverageSummary(reviewCases);

  function updateDraft<Key extends keyof DraftReviewCase>(key: Key, value: DraftReviewCase[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = draft.title.trim();
    const owner = draft.owner.trim();

    if (!title || !owner) {
      setFeedback("Add both a case title and an owner before queueing review work.");
      return;
    }

    const nextCase = createReviewCase(title, owner, draft.lane, reviewCases.length + 1);

    setReviewCases((current) => [nextCase, ...current]);
    setDraft(emptyDraft);
    setFeedback(`${title} is queued for review-owned test generation.`);
  }

  function handleToggle(caseId: string) {
    setReviewCases((current) => current.map((item) => (item.id === caseId ? { ...item, generated: !item.generated } : item)));
  }

  function handleSearchChange(value: string) {
    startTransition(() => {
      setSearch(value);
    });
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Workflow demo</p>
          <h1>Proofboard keeps review-stage test generation visible.</h1>
          <p className="hero-copy">This demo mirrors the workflow split you asked for: planning defines the matrix, review materializes the executable unit and e2e suites.</p>
        </div>

        <div className="metric-grid" aria-label="coverage summary cards">
          <article className="metric-card accent-card">
            <span className="metric-label">Review-ready coverage</span>
            <strong className="metric-value">
              {summary.generated} / {summary.total}
            </strong>
            <span className="metric-detail">{summary.percent}% of cases generated</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Unit lane</span>
            <strong className="metric-value">{summary.byLane.unit.generated}</strong>
            <span className="metric-detail">of {summary.byLane.unit.total} deterministic checks landed</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">E2E lane</span>
            <strong className="metric-value">{summary.byLane.e2e.generated}</strong>
            <span className="metric-detail">of {summary.byLane.e2e.total} journeys landed</span>
          </article>
        </div>
      </section>

      <section className="workspace-grid">
        <article className="panel control-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Queue a review package</p>
              <h2>Add a test case to the handoff board</h2>
            </div>
            <span className="pill">Review owns final test files</span>
          </div>

          <form className="case-form" onSubmit={handleSubmit}>
            <label htmlFor={titleId}>
              Case title
              <input id={titleId} name="title" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Checkout retry copy" />
            </label>

            <label htmlFor={ownerId}>
              Owner
              <input id={ownerId} name="owner" value={draft.owner} onChange={(event) => updateDraft("owner", event.target.value)} placeholder="Mina" />
            </label>

            <label htmlFor={laneId}>
              Target lane
              <select id={laneId} name="lane" value={draft.lane} onChange={(event) => updateDraft("lane", event.target.value as TestLane)}>
                {laneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-action" type="submit">
              Queue test case
            </button>
          </form>

          <p className="feedback-banner" role="status" aria-live="polite">
            {feedback}
          </p>
        </article>

        <article className="panel backlog-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Generated by review</p>
              <h2>Review board</h2>
            </div>
            <span className="pill muted-pill">{visibleCases.length} visible</span>
          </div>

          <label className="search-field" htmlFor={searchId}>
            Search by title, owner, or lane
            <input id={searchId} value={search} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Search generated tests" />
          </label>

          <div className="case-list" aria-live="polite">
            {visibleCases.length === 0 ? (
              <div className="empty-state">
                <p>No review cases match this filter.</p>
                <span>Try another owner, lane, or title keyword.</span>
              </div>
            ) : (
              visibleCases.map((item) => (
                <article className="case-card" key={item.id}>
                  <div className="case-card__meta">
                    <span className={`lane-badge lane-${item.lane}`}>{item.lane}</span>
                    <span className={`state-badge ${item.generated ? "state-generated" : "state-gap"}`}>{item.generated ? "Generated" : "Missing"}</span>
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p className="case-note">{item.note}</p>
                  </div>

                  <div className="case-card__footer">
                    <p>
                      Owner <strong>{item.owner}</strong>
                    </p>
                    <button className="secondary-action" type="button" onClick={() => handleToggle(item.id)} aria-label={item.generated ? `Reopen ${item.title} as a coverage gap` : `Mark ${item.title} as generated`}>
                      {item.generated ? "Reopen gap" : "Mark generated"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
