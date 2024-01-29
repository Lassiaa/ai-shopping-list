import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./views/Main";
import Login from "./views/Login";
import Groups from "./views/Groups";
import Logs from "./views/Logs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
