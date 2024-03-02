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
    console.log(process.env);
    console.log(typeof process.env.REACT_APP_VCS_URL, "vcsUrl");
    console.log(process.env.REACT_APP_CLIENT_ID, "clientId");
    console.log(process.env.REACT_APP_CLIENT_SECRET, "clientSecret");

    let vcsClient = new (VCS as any).VCSClient(
      process.env.REACT_APP_VCS_URL,
      process.env.REACT_APP_CLIENT_ID,
      process.env.REACT_APP_CLIENT_SECRET
    );
    console.log(vcsClient, "vcsClient");
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
