import Flow from "./pages/Flow"
import UserFlow from "../src/pages/UserFlow"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div style={{height: '100vh', width: '100%'}}><Flow /></div>}/>
        <Route path="/user/:id" element={<div style={{height: '100vh', width: '100%'}}><UserFlow /></div>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
