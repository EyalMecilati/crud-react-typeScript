import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import Songs from "./comp/Songs";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

Amplify.configure(awsmobile);

function App() {
  return (
    <div className="App">
      <div className="App-header">
      <AmplifySignOut  className='signout'/>
      </div>
      <Songs />
    </div>
  );
}

export default withAuthenticator(App);
