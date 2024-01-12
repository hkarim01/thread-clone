"use client";

import { PlusCircle, XCircle } from "lucide-react";

import { Button } from "../ui/button";
import { useState } from "react";
import Searchbar from "./Searchbar";

const NewChat = () => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex justify-between w-full items-end gap-4">
        <Button
          className="bg-dark-2 text-light-2 border border-gray-800 rounded-full w-32"
          onClick={() => setShowSearch(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          New
        </Button>
        {showSearch && (
          <XCircle
            size={20}
            color="white"
            className="cursor-pointer"
            onClick={() => setShowSearch(false)}
          />
        )}
      </div>

      {showSearch && (
        <Searchbar routeType="messages" placeholder="Search users" />
      )}
    </div>
  );
};

export default NewChat;
