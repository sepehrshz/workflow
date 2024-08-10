import { DatePicker, Select } from "antd";
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa6";

const { RangePicker } = DatePicker;

function Filter({
  search,
}: {
  search: (data: { user: string; selectedDates: Date[] }) => void;
}) {
  const [user, setUser] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>();
  const onUserChange = (event) => {
    setUser(event.target.value);
  };

  const onDateChange = (dates, dateStrings) => {
    setSelectedDates([dates[0], dates[1].add(1, "day")]);
  };

  useEffect(() => {
    search({ user, selectedDates });
  }, [user, selectedDates]);

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  return (
    <div className="absolute z-40 flex items-center justify-between px-4 bg-white border-2 border-indigo-400 shadow h-20 rounded-lg top-5 left-1/2 -translate-x-1/2">
      <div className="px-4 h-full min-w-64 flex items-center space-x-3">
        <span>User: </span>
        <input
          type="search"
          name="username"
          autoComplete="off"
          onChange={onUserChange}
          placeholder="Enter user name"
          className="block bg-gray-50 outline-none p-2 w-full h-10 border text-sm rounded-lg border-gray-300"
        />
      </div>
      <div className="px-4 h-full flex items-center space-x-3">
        <span>Time: </span>
        <RangePicker
          onChange={onDateChange}
          className="h-10 min-w-64 bg-gray-50"
        />
      </div>
      <div className="px-4 h-full flex items-center space-x-3">
        <span>Type: </span>
        <Select
          className="bg-gray-50"
          showSearch
          placeholder="Please select"
          optionFilterProp="label"
          // onChange={onChange}
          onSearch={onSearch}
          options={[
            {
              value: "jack",
              label: "Jack",
            },
            {
              value: "lucy",
              label: "Lucy",
            },
            {
              value: "tom",
              label: "Tom",
            },
          ]}
        />
      </div>
      <button className="relative bg-gray-100 rounded-md p-3">
        <FaFilter />
      </button>
    </div>
  );
}

export default Filter;
