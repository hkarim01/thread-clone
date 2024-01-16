import { render, screen } from "@testing-library/react";
import Home from "@/app/(root)/page";

jest.mock("@clerk/nextjs", () => ({
  currentUser: jest.fn(() => ({ name: "Hamad" })),
}));

jest.mock("@/lib/actions/user.actions", () => ({
  fetchUser: jest.fn(() => ({
    _id: "1234",
    id: "user_2YtntPXTInrOioqGxjyJnkEBzxM",
    __v: 14,
    bio: "Software Engineer | Web Developer | NextJS/ReactJS",
    communities: ["123", "234"],
    image: "https://utfs.io/f/32ccf736-d7b3-4e74-8c18-2404a277966d-1j4zgt.jpg",
    name: "Hamad Ul Karim",
    onboarded: true,
    username: "hkarim",
    followers: [],
    followings: [],
  })),
}));

jest.mock("@/lib/actions/thread.actions", () => ({
  fetchThreads: jest.fn(() => ({
    threads: [
      {
        _id: "123",
        text: "Hamad",
      },
    ],
    isNext: true,
  })),
}));
// const searchParams = {
//   page: "2",
// };
describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
