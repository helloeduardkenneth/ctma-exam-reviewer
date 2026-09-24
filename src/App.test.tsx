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
    await user.click(screen.getByRole("button", { name: "Start 6-question session" }));

    expect(await screen.findByRole("progressbar")).toHaveAttribute("aria-valuemax", "6");
    expect(screen.getByText(/You will review the correct answer and explanation next/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Review answer" })).not.toBeInTheDocument();
    const choices = screen.getAllByRole("radio");
    await user.click(choices[0]);

    expect(choices[0]).toBeChecked();
    choices.forEach((choice) => expect(choice).toBeDisabled());
    expect(screen.getByRole("button", { name: "Review answer" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Review answer" }));
    expect(await screen.findByRole("heading", { level: 2 })).toHaveFocus();
  });

  it("completes a focused session and supports a fresh setup", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Study focus"), "Risk-Based Approach");
    await user.click(screen.getByRole("checkbox", { name: /Shuffle questions/ }));
    await user.click(screen.getByRole("button", { name: "Start 6-question session" }));

    for (let index = 0; index < 6; index += 1) {
      const group = await screen.findByRole("radiogroup", { name: "Answer choices" });
      await user.click(within(group).getAllByRole("radio")[0]);
      await user.click(screen.getByRole("button", { name: "Review answer" }));
      await user.click(
        screen.getByRole("button", {
          name: index === 5 ? "View results" : "Continue",
        }),
      );
    }

    expect(await screen.findByText("Session complete")).toBeInTheDocument();
    expect(screen.getByText(/of 6 correct/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Choose a new focus" }));
    expect(await screen.findByRole("heading", { name: "Build your session" })).toBeInTheDocument();
  });

  it("switches to Europe edition and updates study topics accordingly", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Default is Global
    expect(screen.getByRole("radio", { name: /Global/ })).toHaveAttribute("aria-checked", "true");
    const topicSelect = screen.getByLabelText("Study focus");
    expect(within(topicSelect).getByText("AML/BSA Compliance")).toBeInTheDocument();
    expect(within(topicSelect).getByText("SAR Filing")).toBeInTheDocument();
    expect(within(topicSelect).queryByText("AML/EU Directive Compliance")).not.toBeInTheDocument();
    expect(within(topicSelect).queryByText("STR Filing")).not.toBeInTheDocument();

    // Switch to Europe
    await user.click(screen.getByRole("radio", { name: /Europe/ }));
    expect(screen.getByRole("radio", { name: /Europe/ })).toHaveAttribute("aria-checked", "true");

    // Check Europe-specific topics are available
    expect(within(topicSelect).getByText("AML/EU Directive Compliance")).toBeInTheDocument();
    expect(within(topicSelect).getByText("STR Filing")).toBeInTheDocument();
    expect(within(topicSelect).queryByText("AML/BSA Compliance")).not.toBeInTheDocument();
    expect(within(topicSelect).queryByText("SAR Filing")).not.toBeInTheDocument();

    // Filter by STR Filing (7 questions in Europe set)
    await user.selectOptions(topicSelect, "STR Filing");
    expect(screen.getByRole("button", { name: "Start 7-question session" })).toBeInTheDocument();

    // Start Europe study session
    await user.click(screen.getByRole("checkbox", { name: /Shuffle questions/ }));
    await user.click(screen.getByRole("button", { name: "Start 7-question session" }));

    expect(await screen.findByRole("progressbar")).toHaveAttribute("aria-valuemax", "7");
    expect(screen.getByText("Practice mode (Europe)")).toBeInTheDocument();
  });

  it("smoothly maps equivalent topics when toggling between editions", async () => {
    const user = userEvent.setup();
    render(<App />);

    const topicSelect = screen.getByLabelText("Study focus");
    await user.selectOptions(topicSelect, "SAR Filing");

    // Switch to Europe -> should map SAR Filing to STR Filing
    await user.click(screen.getByRole("radio", { name: /Europe/ }));
    expect(topicSelect).toHaveValue("STR Filing");

    // Switch back to Global -> should map STR Filing back to SAR Filing
    await user.click(screen.getByRole("radio", { name: /Global/ }));
    expect(topicSelect).toHaveValue("SAR Filing");
  });
});

