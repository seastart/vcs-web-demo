import { RouteConfig } from "react-router-config";
import HomePage from "../views/homePage";
import Login from "../views/login";
import Register from "../views/register";
import Forget from "../views/forget";
import Room from "../views/room";
import VideoPlay from "../views/videoPlay";
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
  {
    path: "/room",
    component: Room,
  },
  {
    path: "/videoPlay",
    component: VideoPlay,
  },
];
export default routes;
