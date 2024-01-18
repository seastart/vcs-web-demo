import React from "react";
import logo from "./logo.svg";
import "./App.css";
import routes from "./routes";
import { renderRoutes, RouteConfig } from "react-router-config";
function App() {
  return <div className="App">{renderRoutes(routes as RouteConfig[])}</div>;
}

export default App;
