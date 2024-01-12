import { Braces } from "lucide-react";

const NoData = () => {
  return (
    <div className="flex flex-col w-full items-center mt-20">
      <Braces size={60} />
      <h2 className="text-heading2-semibold">No Data!</h2>
    </div>
  );
};

export default NoData;
