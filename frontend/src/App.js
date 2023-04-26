import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPost from "./components/AddPost";
import AddUser from "./components/Register";

export default function App() {

  return (
    <div className="view">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AddPost />} />
          <Route path="/register" element={<AddUser />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
