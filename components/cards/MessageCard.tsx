import { formatTimeString } from "@/lib/utils";
import { MessageType } from "@/types";

const MessageCard = ({
  message,
  isOwner,
}: {
  message: MessageType;
  isOwner: boolean;
}) => {
  return (
    <article className={"w-full text-light-2"}>
      <div
        className={`flex w-full ${isOwner ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`${
            isOwner ? "bg-light-4" : "bg-dark-4"
          } min-w-[150px] max-w-[80%] py-1 px-3 rounded-2xl`}
        >
          <p>{message.content}</p>
          <div className="flex justify-end w-full">
            <p className="text-tiny-medium">
              {formatTimeString(message.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MessageCard;
