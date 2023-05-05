import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPost from "./components/AddPost";
import AddUser from "./components/Register";
import ViewPosts from "./components/ViewPosts";
import Login from "./components/Login";
import TestPosts from "./components/TestPosts";
import TwoFactorCheck from "./components/TwoFactorCheck";
import MyPosts from "./components/MyPosts";

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
          <Route path="/2FA" element={<TwoFactorCheck />} />
          <Route path="/my-posts" element={<MyPosts />} />
        </Routes>
      </BrowserRouter>
      <div className="disclaimer">
        <br/><br/>
        <p>Disclaimer: Any post made to this site solely reflects the posting user's beliefs and is not endorsed in any way by the site</p>
        <p>The site will accept no responsibility for any posts made by users. We also do not guarantee the factual reliability of any posts.</p>
      </div>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
