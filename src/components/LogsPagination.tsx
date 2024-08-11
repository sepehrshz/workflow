import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const LogsPagination = ({ onChangePage, userNumber }) => {
  const userNum = userNumber;
  const [active, setActive] = useState(1);
  const onButtonClick = (index: number) => {
    setActive(index);
    onChangePage(index);
  };
  const change = (action: string) => {
    if (action === "next" && active !== Math.ceil(userNum / 4)) {
      onButtonClick(active + 1);
    } else if (action === "prev" && active !== 1) {
      onButtonClick(active - 1);
    }
  };
  const divs = [];

  for (let i = 1; i <= Math.ceil(userNum / 4); i++) {
    divs.push(
      <a
        key={i}
        onClick={() => onButtonClick(i)}
        className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer
        ${active === i ? "bg-indigo-500 text-white" : "bg-white text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50"}`}
      >
        {i}
      </a>,
    );
  }
  return (
    <div className="z-40 bg-white flex items-center justify-between -mt-4 rounded-md sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <a
              onClick={() => change("prev")}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </a>
            {divs}
            <a
              onClick={() => change("next")}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
export default LogsPagination;
