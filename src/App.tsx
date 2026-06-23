import { createBrowserRouter } from "react-router";

import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Cart } from "./pages/Cart";
import { Dashboard } from "./pages/Dashboard";
import { New } from "./pages/Dashboard/New";
import { NotFound } from "./pages/NotFound";
import { PrivCart } from "./routes/PrivateCart";
import { PrivDashboard } from "./routes/PrivateDashboard";

import { Layout } from "./components/Layout";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/menu",
        element: <Menu/>
      },
      {
        path: "/cart",
        element: <PrivCart><Cart/></PrivCart>
      },
      {
        path: "/dashboard",
        element: <PrivDashboard><Dashboard/></PrivDashboard>
      },
      {
        path: "/dashboard/new",
        element: <PrivDashboard><New/></PrivDashboard>
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "*",
    element: <NotFound/>
  }
]);

export { router }