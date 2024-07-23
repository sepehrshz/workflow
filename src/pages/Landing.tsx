import { Link } from "react-router-dom";
function Landing() {
  return (
    <div className="flex flex-col h-[100vh] gap-40 w-full justify-center items-center">
      <Link to={"./logs"}>
        <button className="flex justify-center items-center rounded-md w-80 h-24 text-2xl border-4 border-purple-400">
          Logs
        </button>
      </Link>
      <Link to={"./sessions"}>
        <button className="flex justify-center items-center rounded-md w-80 h-24 text-2xl border-4 border-purple-400">
          Sessions
        </button>
      </Link>
    </div>
  );
}

export default Landing;
