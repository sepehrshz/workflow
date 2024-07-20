import LogsFlow from "./pages/LogsFlow";
import SessionsFlow from "./pages/SessionsFlow";
import UserFlow from "../src/pages/UserFlow";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/logs"
          element={
            <div style={{ height: "100vh", width: "100%" }}>
              <LogsFlow />
            </div>
          }
        />
        <Route
          path="/sessions"
          element={
            <div style={{ height: "100vh", width: "100%" }}>
              <SessionsFlow />
            </div>
          }
        />
        <Route
          path="/logs/user/:id"
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
