import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { url } from "./components/url";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const disableRightClick = e => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);
  useEffect(() => {
    const isLogged = localStorage.getItem("admin_logged_in");
    setLoggedIn(!!isLogged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch(url.sendDaily)
      .then(res => res.text())
      .then(data => {
        console.log("send-daily response:", data);
      })
      .catch(err => {
        console.error("send-daily error:", err);
      });
  }, []);

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      {loggedIn ? (
        <Dashboard onLogout={() => {
          localStorage.clear();
          setLoggedIn(false);
        }} />
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </>
  );
}
