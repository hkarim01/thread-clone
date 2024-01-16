import { render, screen } from "@testing-library/react";
import ThreadCard from "@/components/cards/ThreadCard";

describe("ThreadCard", () => {
  it("renders a thread card", () => {
    render(
      <ThreadCard
        id={JSON.stringify("thread_1234")}
        currentUserId={JSON.stringify("user_1234")}
        parentId={"parent_1234"}
        content={"hi there"}
        author={{
          name: "author",
          image: "",
          id: "author_1234",
          _id: "author_1234",
        }}
        community={null}
        createdAt={"Sat"}
        likes={[]}
        comments={[]}
        isComment={false}
      />
    );

    const threadCard = screen.getByTestId("thread_card");

    expect(threadCard).toBeInTheDocument();
  });
});
