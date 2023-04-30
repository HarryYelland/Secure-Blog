import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPost from "./components/AddPost";
import AddUser from "./components/Register";
import ViewPosts from "./components/ViewPosts";
import Login from "./components/Login";
import TestPosts from "./components/TestPosts";

export default function App() {

  return (
    <div className="view">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/post" element={<AddPost />} />
          <Route path="/register" element={<AddUser />} />
          <Route path="/view" element={<ViewPosts />} />
          <Route path="/view-test" element={<TestPosts />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
