import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("CTMA reviewer", () => {
  it("filters a session and locks a selected choice before reveal", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Study focus"), "Risk-Based Approach");
    await user.click(screen.getByRole("checkbox", { name: /Shuffle questions/ }));
    await user.click(screen.getByRole("button", { name: "Start 6-question review" }));

    expect(await screen.findByText("6 total")).toBeInTheDocument();
    const choices = screen.getAllByRole("radio");
    await user.click(choices[0]);

    expect(choices[0]).toHaveAttribute("aria-checked", "true");
    choices.forEach((choice) => expect(choice).toBeDisabled());
    expect(screen.getByRole("button", { name: "Reveal answer" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Reveal answer" }));
    expect(await screen.findByRole("heading", { name: "Answer and explanation" })).toHaveFocus();
  });

  it("completes a focused session and supports a fresh setup", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Study focus"), "Risk-Based Approach");
    await user.click(screen.getByRole("checkbox", { name: /Shuffle questions/ }));
    await user.click(screen.getByRole("button", { name: "Start 6-question review" }));

    for (let index = 0; index < 6; index += 1) {
      const group = await screen.findByRole("radiogroup", { name: "Answer choices" });
      await user.click(within(group).getAllByRole("radio")[0]);
      await user.click(screen.getByRole("button", { name: "Reveal answer" }));
      await user.click(
        screen.getByRole("button", {
          name: index === 5 ? "View results" : "Next question",
        }),
      );
    }

    expect(await screen.findByText("Session complete")).toBeInTheDocument();
    expect(screen.getByText(/of 6 correct/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Choose a new focus" }));
    expect(await screen.findByRole("heading", { name: "Set up your session" })).toBeInTheDocument();
  });
});
