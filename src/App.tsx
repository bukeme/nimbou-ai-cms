import { ToastContainer } from "react-toastify";
import Chat from "./components/Chat";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <ToastContainer />
        <Navbar />

        <Routes>
          <Route path="" element={<Chat />} />
          <Route path="content" element={<Content />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
