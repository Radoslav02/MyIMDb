import { useEffect } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "./components/Redux/store";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    user?.id ? navigate("/home") : navigate("/explore")
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
