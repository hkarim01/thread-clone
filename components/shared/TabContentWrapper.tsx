import { ReactNode } from "react";
import NoData from "./NoData";

const TabContentWrapper = ({ children }: { children: ReactNode }) => {
  return children || <NoData />;
};

export default TabContentWrapper;
