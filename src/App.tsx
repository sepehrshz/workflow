import LogsFlow from "./pages/LogsFlow";
import SessionsFlow from "./pages/SessionsFlow";
import UserFlow from "../src/pages/UserFlow";
import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-[100vh] w-full">
              <Landing />
            </div>
          }
        />
        <Route
          path="/logs"
          element={
            <div className="h-[100vh] w-full">
              <LogsFlow />
            </div>
          }
        />
        <Route
          path="/sessions"
          element={
            <div className="h-[100vh] w-full">
              <SessionsFlow />
            </div>
          }
        />
        <Route
          path="/user/:id"
          element={
            <div style={{ height: "100vh", width: "100%" }}>
              <UserFlow />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
