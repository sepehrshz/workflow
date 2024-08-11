import React from "react";
import LogCount from "../components/LogCount";
import UserNode from "./UserNode";
import { Link } from "react-router-dom";

export const CreateUserNode = (user: string, index: number) => {
  return {
    id: user,
    data: {
      label: (
        <Link
          className="w-full h-full flex justify-center items-center"
          to={`../user/${user}`}
        >
          <UserNode userName={user} />
        </Link>
      ),
    },
    position: { x: 100, y: ((index % 4) + 1) * 150 - 20 },
    count: 0,
    type: "output",
    targetPosition: "right",
    style: {
      width: "200px",
      height: "60px",
      border: "2px solid gray",
      borderRadius: "6px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      backgroundColor: "#f5f5f5",
    },
  };
};
