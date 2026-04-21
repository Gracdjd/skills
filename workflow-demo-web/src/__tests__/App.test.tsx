import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App", () => {
  it("queues a new review case and updates summary after generation", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/Case title/i), "Checkout retry copy");
    await user.type(screen.getByLabelText(/^Owner$/i), "Mina");
    await user.selectOptions(screen.getByLabelText(/Target lane/i), "e2e");
    await user.click(screen.getByRole("button", { name: /Queue test case/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Checkout retry copy is queued for review-owned test generation.");

    const card = screen.getByRole("heading", { name: "Checkout retry copy" }).closest("article");
    expect(card).not.toBeNull();
    expect(within(card!).getByText("Missing")).toBeInTheDocument();

    await user.click(within(card!).getByRole("button", { name: /Mark Checkout retry copy as generated/i }));

    expect(within(card!).getByText("Generated")).toBeInTheDocument();
    expect(screen.getByText("3 / 5")).toBeInTheDocument();
    expect(screen.getByText("60% of cases generated")).toBeInTheDocument();
  });

  it("shows validation feedback and empty-state search results", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /Queue test case/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Add both a case title and an owner before queueing review work.");

    await user.type(screen.getByLabelText(/^Search by title, owner, or lane$/i), "zzzz");

    expect(screen.getByText("No review cases match this filter.")).toBeInTheDocument();
    expect(screen.getByText("Try another owner, lane, or title keyword.")).toBeInTheDocument();
  });
});
