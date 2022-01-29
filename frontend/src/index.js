import React from "react";
import ReactDOM from "react-dom";
// import { Dapp } from "./components/Dapp";
import DietTracker from "./components/Diet";
import Layout from "./components/Layout";

import "./index.css";
// import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <DietTracker />
    </Layout>
  </React.StrictMode>,
  document.getElementById("root")
);
