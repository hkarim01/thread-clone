import { render, screen } from "@testing-library/react";
import MessageForm from "@/components/forms/MessageForm";

describe("MessageForm", () => {
  it("renders a heading", () => {
    render(<MessageForm />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
