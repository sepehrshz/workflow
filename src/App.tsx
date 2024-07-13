import Flow from "../components/Flow"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Flow />}>
        </Route>
      </Routes>
    </BrowserRouter>
      // <div style={{height: '100vh', width: '100%'}}>
  )
}

export default App
