import LogsFlow from "./pages/LogsFlow";
import SessionsFlow from "./pages/SessionsFlow";
import UserFlow from "../src/pages/UserFlow";
import Landing from "./pages/Landing";
import Navigator from "./layouts/Navigator";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-[100vh] w-full">
              <Navigator>
                <Landing />
              </Navigator>
            </div>
          }
        />
        <Route
          path="/logs"
          element={
            <div className="h-[100vh] w-full">
              <Navigator>
                <LogsFlow />
              </Navigator>
            </div>
          }
        />
        <Route
          path="/sessions"
          element={
            <div className="h-[100vh] w-full">
              <Navigator>
                <SessionsFlow />
              </Navigator>
            </div>
          }
        />
        <Route
          path="/user/:id"
          element={
            <div style={{ height: "100vh", width: "100%" }}>
              <Navigator>
                <UserFlow />
              </Navigator>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
