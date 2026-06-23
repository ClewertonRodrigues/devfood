import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "../Header";
import Aos from "aos";
import "aos/dist/aos.css";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    Aos.init({
      duration: 500,
      once: true,
    });
  }, []);

  useEffect(() => {
    Aos.refresh();
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
