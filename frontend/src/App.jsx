import { useState, useEffect } from "react";
import Home from "./components/homepage";
import Login from "./components/login";
import Register from "./components/register";
import Mainpage from "./components/mainpage";

function App() {

  const [isloggedin, setisloggedin] =
    useState(false);

  const [page, setpage] =
    useState("Home");

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {
      setisloggedin(true);
    }

  }, []);

  if (isloggedin) {
    return (
      <Mainpage
        setisloggedin={setisloggedin}
      />
    );
  }

  if (page === "login") {
    return (
      <Login
        setpage={setpage}
        setisloggedin={setisloggedin}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        setpage={setpage}
      />
    );
  }

  return (
    <Home
      setpage={setpage}
    />
  );
}

export default App;