import { render, screen } from "@testing-library/react";
import NoData from "@/components/shared/NoData";

describe("NoData", () => {
  it("renders a heading", () => {
    render(<NoData />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
