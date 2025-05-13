import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm.tsx";
import Home from "./components/Home.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
