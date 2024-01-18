import { RouteConfig } from "react-router-config";
import HomePage from "../views/homePage";
import Login from "../views/login";
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
];
export default routes;
