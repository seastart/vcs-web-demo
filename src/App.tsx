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
function App() {
  useEffect(() => {
    let vcsClient = new (VCS as any).VCSClient(
      "http://192.168.0.229:9001/vcs",
      "0a16828823ce41c5ad040be3ed384c14",
      "04ff1dae18ae4b1fb7057e239aa1ff03"
    );
    console.log((VCS as any).VERSION, "VERSION");
    store.dispatch(setVersion((VCS as any).VERSION));
    store.dispatch(setVCSClient(vcsClient));
  }, []);
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <div className="App">{renderRoutes(routes as RouteConfig[])}</div>{" "}
      </PersistGate>
    </Provider>
  );
}

export default App;
