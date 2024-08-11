import LogsPagination from "./LogsPagination";

export const CreateLogPaginationNode = (
  user: string,
  handleLogPage,
  userFilterLogLength,
  yPosition: number,
) => {
  return {
    id: user + "-pagination",
    data: {
      label: (
        <div className="flex justify-center items-center">
          <LogsPagination
            onChangePage={handleLogPage}
            userNumber={userFilterLogLength / 2}
          />
        </div>
      ),
    },
    position: { x: 400, y: yPosition + 80 },
    style: {
      width: "150px",
      height: "20px",
      border: "none",
      shadow: "none",
    },
  };
};
