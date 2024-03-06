import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { VCSContext } from "./VCSContext";
import * as VCS from "./utils/vcs.js";
import { store, persistor } from "./store/store";
import { setVCSClient } from "./actions/vcsActions";
import { setVersion } from "./actions/versionActions";
import { Provider } from "react-redux";
const { PersistGate } = require("redux-persist/integration/react");

import "./App.css";
import routes from "./routes";
import { renderRoutes, RouteConfig } from "react-router-config";
import { message } from "antd";
function App() {
  useEffect(() => {
    console.log(process.env, "env");
    if (sessionStorage.getItem("vcsUrl")) {
      let vcsClient = new (VCS as any).VCSClient(
        sessionStorage.getItem("vcsUrl"),
        sessionStorage.getItem("clientId"),
        sessionStorage.getItem("clientSecret")
      );
      console.log(vcsClient, "vcsClient");
      console.log((VCS as any).VERSION, "VERSION");
      store.dispatch(setVersion((VCS as any).VERSION));
      store.dispatch(setVCSClient(vcsClient));
    } else {
      fetch(`${process.env.PUBLIC_URL}/vcsConfig.json`)
        //默认返回response，response下有一个json方法可供使用
        .then((response) => response.json())
        .then((data) => {
          // 处理返回的数据
          console.log(data.vcsUrl, "rrr");
          sessionStorage.setItem("vcsUrl", data.vcsUrl);
          sessionStorage.setItem("clientId", data.clientId);
          sessionStorage.setItem("clientSecret", data.clientSecret);
          let vcsClient = new (VCS as any).VCSClient(
            sessionStorage.getItem("vcsUrl")
              ? sessionStorage.getItem("vcsUrl")
              : data.vcsUrl,
            sessionStorage.getItem("clientId")
              ? sessionStorage.getItem("clientId")
              : data.clientId,
            sessionStorage.getItem("clientSecret")
              ? sessionStorage.getItem("clientSecret")
              : data.clientSecret
          );
          console.log(vcsClient, "vcsClient");
          console.log((VCS as any).VERSION, "VERSION");
          store.dispatch(setVersion((VCS as any).VERSION));
          store.dispatch(setVCSClient(vcsClient));
        })
        .catch((error) => {
          // 处理请求错误
          console.log(error.message);
          message.info(error.message);
        });
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">{renderRoutes(routes as RouteConfig[])}</div>{" "}
      </PersistGate>
    </Provider>
  );
}

export default App;
