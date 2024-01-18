import { RouteConfig } from "react-router-config";
import HomePage from "../views/homePage";
import Login from "../views/login";
import Register from "../views/register";
import Forget from "../views/forget";
const routes: RouteConfig = [
  {
    path: "/",
    exact: true,
    component: HomePage,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/forget",
    component: Forget,
  },
];
export default routes;
